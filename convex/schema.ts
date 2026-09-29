import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scheduleItems: defineTable({
    day: v.union(v.literal("charity"), v.literal("main")),
    time: v.string(),
    title: v.string(),
    note: v.optional(v.string()),
    order: v.number(),
  }).index("by_day_order", ["day", "order"]),

  meetings: defineTable({
    title: v.string(),
    date: v.string(),
    mode: v.union(v.literal("in_person"), v.literal("online"), v.literal("both")),
    location: v.optional(v.string()),
    onlineLink: v.optional(v.string()),
    description: v.string(),
  }).index("by_date", ["date"]),

  pastEvents: defineTable({
    year: v.number(),
    theme: v.optional(v.string()),
    attendance: v.optional(v.number()),
    summary: v.string(),
    photoIds: v.array(v.id("_storage")),
  }).index("by_year", ["year"]),

  galleryPhotos: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  settings: defineTable({
    donationTargetNGN: v.number(),
    donationTargetUSD: v.number(),
    youtubeLiveUrl: v.optional(v.string()),
    liveEnabled: v.boolean(),
    eventStart: v.string(),
  }),

  donations: defineTable({
    reference: v.string(),
    amount: v.number(),
    currency: v.union(v.literal("NGN"), v.literal("USD")),
    donorName: v.optional(v.string()),
    donorEmail: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    monnifyTransactionRef: v.optional(v.string()),
  }).index("by_reference", ["reference"]),

  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
  }).index("by_email", ["email"]),
    siteImages: defineTable({
    slot: v.string(),
    storageId: v.id("_storage"),
  }).index("by_slot", ["slot"]),
});
