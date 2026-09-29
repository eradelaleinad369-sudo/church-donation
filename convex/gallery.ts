import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db.query("galleryPhotos").collect();
    const sorted = photos.sort((a, b) => a.order - b.order);
    return Promise.all(
      sorted.map(async (p) => ({ ...p, url: await ctx.storage.getUrl(p.storageId) }))
    );
  },
});

export const add = mutation({
  args: { storageId: v.id("_storage"), caption: v.optional(v.string()), order: v.number() },
  handler: async (ctx, args) => ctx.db.insert("galleryPhotos", args),
});

export const remove = mutation({
  args: { id: v.id("galleryPhotos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});
