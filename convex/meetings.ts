import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("meetings").order("asc").collect(),
});

const meetingFields = {
  title: v.string(),
  date: v.string(),
  mode: v.union(v.literal("in_person"), v.literal("online"), v.literal("both")),
  location: v.optional(v.string()),
  onlineLink: v.optional(v.string()),
  description: v.string(),
};

export const add = mutation({
  args: meetingFields,
  handler: async (ctx, args) => ctx.db.insert("meetings", args),
});

export const update = mutation({
  args: { id: v.id("meetings"), ...meetingFields },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("meetings") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
