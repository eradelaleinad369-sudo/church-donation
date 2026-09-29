import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "@/convex/_generated/api";
import { verifyMonnifyTransaction } from "@/lib/monnify";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

// Configure this URL in your Monnify dashboard under
// Settings -> Webhooks, so Monnify calls it after every transaction attempt.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const paymentReference: string | undefined = body?.eventData?.paymentReference;
  if (!paymentReference) {
    return NextResponse.json({ error: "Missing paymentReference" }, { status: 400 });
  }

  // Never trust the webhook payload's amount/status on its own — re-check
  // directly with Monnify's API before marking anything as paid.
  const verified = await verifyMonnifyTransaction(paymentReference);

  if (verified.paymentStatus === "PAID" || verified.paymentStatus === "OVERPAID") {
    await convex.mutation(internal.donations.markPaid, {
      reference: paymentReference,
      monnifyTransactionRef: verified.transactionReference,
    });
  } else if (verified.paymentStatus === "FAILED") {
    await convex.mutation(internal.donations.markFailed, { reference: paymentReference });
  }

  return NextResponse.json({ ok: true });
}
