import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function checkAdmin(token: string) {
  if (token.trim() !== (process.env.ADMIN_API_TOKEN ?? "").trim()) throw new Error("Unauthorized");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("scheduleItems").collect();
    return items.sort((a, b) => a.order - b.order);
  },
});

export const add = mutation({
  args: {
    day: v.union(v.literal("charity"), v.literal("main")),
    time: v.string(),
    title: v.string(),
    note: v.optional(v.string()),
    order: v.number(),
    adminToken: v.string(),
  },
  handler: async (ctx, { adminToken, ...rest }) => {
    checkAdmin(adminToken);
    return await ctx.db.insert("scheduleItems", rest);
  },
});

export const update = mutation({
  args: {
    id: v.id("scheduleItems"),
    day: v.union(v.literal("charity"), v.literal("main")),
    time: v.string(),
    title: v.string(),
    note: v.optional(v.string()),
    order: v.number(),
    adminToken: v.string(),
  },
  handler: async (ctx, { id, adminToken, ...rest }) => {
    checkAdmin(adminToken);
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("scheduleItems"), adminToken: v.string() },
  handler: async (ctx, { id, adminToken }) => {
    checkAdmin(adminToken);
    await ctx.db.delete(id);
  },
});