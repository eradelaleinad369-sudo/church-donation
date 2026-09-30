import { NextResponse } from "next/server";
import { getSession } from "@/lib/adminSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ token: process.env.ADMIN_API_TOKEN });
}