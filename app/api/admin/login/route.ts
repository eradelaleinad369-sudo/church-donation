import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { signSession, setSessionCookie } from "@/lib/adminSession";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await convex.query(api.adminUsers.getByEmail, { email });
  if (!user) return NextResponse.json({ error: "Invalid login" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid login" }, { status: 401 });

  setSessionCookie(signSession(user.email));
  return NextResponse.json({ ok: true });
}
