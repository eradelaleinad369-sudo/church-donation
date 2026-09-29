import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get donation totals for the admin dashboard.
 */
export const totals = query({
  args: {},

  handler: async (ctx) => {
    const paid = await ctx.db
      .query("donations")
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    const NGN = paid
      .filter((d) => d.currency === "NGN")
      .reduce((sum, d) => sum + d.amount, 0);

    const USD = paid
      .filter((d) => d.currency === "USD")
      .reduce((sum, d) => sum + d.amount, 0);

    const donorCount = new Set(
      paid.map((d) => d.donorEmail)
    ).size;

    return {
      NGN,
      USD,
      donorCount,
    };
  },
});

/**
 * List all donations for the admin dashboard.
 */
export const listForAdmin = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("donations")
      .order("desc")
      .collect();
  },
});

/**
 * Create a pending donation before sending the donor
 * to the Monnify checkout page.
 */
export const createPending = mutation({
  args: {
    reference: v.string(),
    amount: v.number(),

    currency: v.union(
      v.literal("NGN"),
      v.literal("USD")
    ),

    donorName: v.optional(v.string()),
    donorEmail: v.string(),
  },

  handler: async (ctx, args) => {
    // Prevent duplicate references.
    const existing = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) =>
        q.eq("reference", args.reference)
      )
      .unique();

    if (existing) {
      throw new Error("Donation reference already exists.");
    }

    await ctx.db.insert("donations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Internal mutation used by the secure server-side
 * Monnify webhook.
 *
 * This should NOT be callable directly from the browser.
 */
export const markPaid = internalMutation({
  args: {
    reference: v.string(),
    monnifyTransactionRef: v.string(),
    paymentMethod: v.optional(v.string()),
  },

  handler: async (
    ctx,
    {
      reference,
      monnifyTransactionRef,
      paymentMethod,
    }
  ) => {
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) =>
        q.eq("reference", reference)
      )
      .unique();

    if (!row) {
      throw new Error(
        `Donation not found: ${reference}`
      );
    }

    // Don't overwrite an already-paid donation.
    if (row.status === "paid") {
      return;
    }

    await ctx.db.patch(row._id, {
      status: "paid",
      monnifyTransactionRef,
      paymentMethod,
      paidAt: Date.now(),
    });
  },
});

/**
 * Internal mutation for failed/cancelled payments.
 */
export const markFailed = internalMutation({
  args: {
    reference: v.string(),
  },

  handler: async (ctx, { reference }) => {
    const row = await ctx.db
      .query("donations")
      .withIndex("by_reference", (q) =>
        q.eq("reference", reference)
      )
      .unique();

    if (!row) {
      throw new Error(
        `Donation not found: ${reference}`
      );
    }

    // Don't change a successful payment to failed.
    if (row.status === "paid") {
      return;
    }

    await ctx.db.patch(row._id, {
      status: "failed",
    });
  },
});