import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function checkAdmin(token: string) {
  if (token.trim() !== (process.env.ADMIN_API_TOKEN ?? "").trim()) throw new Error("Unauthorized");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("pastEvents").collect();
    return events.sort((a, b) => b.year - a.year);
  },
});

export const add = mutation({
  args: {
    year: v.number(),
    theme: v.optional(v.string()),
    attendance: v.optional(v.number()),
    summary: v.string(),
    photoIds: v.array(v.id("_storage")),
    adminToken: v.string(),
  },
  handler: async (ctx, { adminToken, ...rest }) => {
    checkAdmin(adminToken);
    return await ctx.db.insert("pastEvents", rest);
  },
});

export const remove = mutation({
  args: { id: v.id("pastEvents"), adminToken: v.string() },
  handler: async (ctx, { id, adminToken }) => {
    checkAdmin(adminToken);
    await ctx.db.delete(id);
  },
});

export const generateUploadUrl = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    checkAdmin(adminToken);
    return await ctx.storage.generateUploadUrl();
  },
});