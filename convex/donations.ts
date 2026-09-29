import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const totals = query({
  args: {},
  handler: async (ctx) => {
    const paid = await ctx.db
      .query("donations")
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();
    const NGN = paid.filter((d) => d.currency === "NGN").reduce((s, d) => s + d.amount, 0);
    const USD = paid.filter((d) => d.currency === "USD").reduce((s, d) => s + d.amount, 0);
    const donorCount = new Set(paid.map((d) => d.donorEmail)).size;
    return { NGN, USD, donorCount };
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => ctx.db.query("donations").order("desc").collect(),
});

export const createPending = mutation({
  args: {
    reference: v.string(),
    amount: v.number(),
    currency: v.union(v.literal("NGN"), v.literal("USD")),
    donorName: v.optional(v.string()),
    donorEmail: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("donations", { ...args, status: "pending" });
  },
});

export const markPaid = mutation({
  args: { reference: v.string(), monnifyTransactionRef: v.string(), secret: v.string() },
  handler: async (ctx, { reference, monnifyTransactionRef, secret }) => {
    if (secret !== process.env.WEBHOOK_SECRET) throw new Error("Unauthorized");
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) => q.eq("reference", reference))
      .unique();
    if (row) await ctx.db.patch(row._id, { status: "paid", monnifyTransactionRef });
  },
});

export const markFailed = mutation({
  args: { reference: v.string(), secret: v.string() },
  handler: async (ctx, { reference, secret }) => {
    if (secret !== process.env.WEBHOOK_SECRET) throw new Error("Unauthorized");
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) => q.eq("reference", reference))
      .unique();
    if (row) await ctx.db.patch(row._id, { status: "failed" });
  },
});