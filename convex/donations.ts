import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Sum of PAID donations only — never trust pending/unverified amounts.
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

// Called from the donate form right before Monnify checkout opens,
// so we have a record to reconcile against when the webhook fires.
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

// Called ONLY from the server-side Monnify webhook handler after the
// transaction status has been verified directly with Monnify's API.
export const markPaid = internalMutation({
  args: { reference: v.string(), monnifyTransactionRef: v.string() },
  handler: async (ctx, { reference, monnifyTransactionRef }) => {
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) => q.eq("reference", reference))
      .unique();
    if (row) await ctx.db.patch(row._id, { status: "paid", monnifyTransactionRef });
  },
});

export const markFailed = internalMutation({
  args: { reference: v.string() },
  handler: async (ctx, { reference }) => {
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) => q.eq("reference", reference))
      .unique();
    if (row) await ctx.db.patch(row._id, { status: "failed" });
  },
});
