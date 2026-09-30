import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function checkAdmin(token: string) {
  if (token.trim() !== (process.env.ADMIN_API_TOKEN ?? "").trim()) throw new Error("Unauthorized");
}

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
  args: { storageId: v.id("_storage"), caption: v.optional(v.string()), order: v.number(), adminToken: v.string() },
  handler: async (ctx, { adminToken, ...rest }) => {
    checkAdmin(adminToken);
    return await ctx.db.insert("galleryPhotos", rest);
  },
});

export const remove = mutation({
  args: { id: v.id("galleryPhotos"), adminToken: v.string() },
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