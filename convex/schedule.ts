import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduleItems", args);
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
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("scheduleItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
