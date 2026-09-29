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
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const setSlot = mutation({
  args: { slot: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { slot, storageId }) => {
    const existing = await ctx.db
      .query("siteImages")
      .withIndex("by_slot", (q) => q.eq("slot", slot))
      .unique();
    if (existing) await ctx.db.patch(existing._id, { storageId });
    else await ctx.db.insert("siteImages", { slot, storageId });
  },
});