import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getByEmailInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .unique();
  },
});

// Bootstrap-only: run via `npx convex run adminUsers:create` (requires your
// Convex deploy credentials) — never callable from a browser or public API.
export const create = internalMutation({
  args: { email: v.string(), passwordHash: v.string() },
  handler: async (ctx, { email, passwordHash }) => {
    await ctx.db.insert("adminUsers", { email: email.toLowerCase(), passwordHash });
  },
});