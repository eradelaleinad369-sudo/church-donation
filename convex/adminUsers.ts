import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Used only by the Next.js login API route (server-side, never exposed to the browser).
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .unique();
  },
});

// Run this once from the Convex dashboard's function runner (or `npx convex run`)
// to create your first admin login — see README "Create your first admin".
export const create = mutation({
  args: { email: v.string(), passwordHash: v.string() },
  handler: async (ctx, { email, passwordHash }) => {
    await ctx.db.insert("adminUsers", { email: email.toLowerCase(), passwordHash });
  },
});
