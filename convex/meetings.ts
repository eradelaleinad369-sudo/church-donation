import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function checkAdmin(token: string) {
  if (token.trim() !== (process.env.ADMIN_API_TOKEN ?? "").trim()) throw new Error("Unauthorized");
}

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
  args: { ...meetingFields, adminToken: v.string() },
  handler: async (ctx, { adminToken, ...rest }) => {
    checkAdmin(adminToken);
    return await ctx.db.insert("meetings", rest);
  },
});

export const update = mutation({
  args: { id: v.id("meetings"), ...meetingFields, adminToken: v.string() },
  handler: async (ctx, { id, adminToken, ...rest }) => {
    checkAdmin(adminToken);
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("meetings"), adminToken: v.string() },
  handler: async (ctx, { id, adminToken }) => {
    checkAdmin(adminToken);
    await ctx.db.delete(id);
  },
});