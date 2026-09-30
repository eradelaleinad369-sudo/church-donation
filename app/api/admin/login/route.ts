import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { signSession, setSessionCookie } from "@/lib/adminSession";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await convex.action(api.adminAuth.verifyLogin, { email, password });
  if (!result.ok) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  setSessionCookie(await signSession(result.email!));
  return NextResponse.json({ ok: true });
}