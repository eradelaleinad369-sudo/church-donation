import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { verifyMonnifyTransaction } from "@/lib/monnify";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const paymentReference: string | undefined = body?.eventData?.paymentReference;
  if (!paymentReference) {
    return NextResponse.json({ error: "Missing paymentReference" }, { status: 400 });
  }

  const verified = await verifyMonnifyTransaction(paymentReference);
  const secret = process.env.WEBHOOK_SECRET as string;

  if (verified.paymentStatus === "PAID" || verified.paymentStatus === "OVERPAID") {
    await convex.mutation(api.donations.markPaid, {
      reference: paymentReference,
      monnifyTransactionRef: verified.transactionReference,
      secret,
    });
  } else if (verified.paymentStatus === "FAILED") {
    await convex.mutation(api.donations.markFailed, { reference: paymentReference, secret });
  }

  return NextResponse.json({ ok: true });
}
