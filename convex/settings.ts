import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("settings").collect();
    return rows[0] ?? null;
  },
});

export const upsert = mutation({
  args: {
    donationTargetNGN: v.number(),
    donationTargetUSD: v.number(),
    youtubeLiveUrl: v.optional(v.string()),
    liveEnabled: v.boolean(),
    eventStart: v.string(),
    adminToken: v.string(),
  },
  handler: async (ctx, { adminToken, ...args }) => {
        if (adminToken.trim() !== (process.env.ADMIN_API_TOKEN ?? "").trim()) throw new Error("Unauthorized");
    const rows = await ctx.db.query("settings").collect();
    if (rows[0]) {
      await ctx.db.patch(rows[0]._id, args);
    } else {
      await ctx.db.insert("settings", args);
    }
  },
});