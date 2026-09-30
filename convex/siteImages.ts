import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("siteImages").collect();
    const urls: Record<string, string | null> = {};
    for (const row of rows) {
      urls[row.slot] = await ctx.storage.getUrl(row.storageId);
    }
    return urls;
  },
});

export const generateUploadUrl = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, { adminToken }) => {
    if (adminToken !== process.env.ADMIN_API_TOKEN) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const setSlot = mutation({
  args: { slot: v.string(), storageId: v.id("_storage"), adminToken: v.string() },
  handler: async (ctx, { slot, storageId, adminToken }) => {
    if (adminToken !== process.env.ADMIN_API_TOKEN) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("siteImages")
      .withIndex("by_slot", (q) => q.eq("slot", slot))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { storageId });
    else await ctx.db.insert("siteImages", { slot, storageId });
  },
});