"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

// Public, but only ever returns ok/true-or-false — the hash never leaves Convex.
export const verifyLogin = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }): Promise<{ ok: boolean; email?: string }> => {
    const user = await ctx.runQuery(internal.adminUsers.getByEmailInternal, { email });
    if (!user) return { ok: false };
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? { ok: true, email: user.email } : { ok: false };
  },
});