import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/adminSession";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
