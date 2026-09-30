import { internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

// Internal only — Convex enforces that this can never be called from
// outside Convex (not from the browser, not from any external client).
export const getByEmailInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .unique();
  },
});

export const create = mutation({
  args: { email: v.string(), passwordHash: v.string() },
  handler: async (ctx, { email, passwordHash }) => {
    await ctx.db.insert("adminUsers", { email: email.toLowerCase(), passwordHash });
  },
});