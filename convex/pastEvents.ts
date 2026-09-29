import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
  },
  handler: async (ctx, args) => ctx.db.insert("pastEvents", args),
});

export const remove = mutation({
  args: { id: v.id("pastEvents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Called by the admin UI to get an upload URL for a photo, then the
// returned storageId is saved via `add` above.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});
