import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { ConvexHttpClient } from "convex/browser";
import { internal } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const signature =
      req.headers.get("monnify-signature");

    const secret =
      process.env.MONNIFY_SECRET_KEY;

    if (!signature || !secret) {
      console.error(
        "Missing Monnify signature or secret."
      );

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const expectedSignature =
      crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      console.error(
        "Invalid Monnify webhook signature."
      );

      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    console.log(
      "Monnify webhook received:",
      payload
    );

    const eventType =
      payload.eventType;

    const eventData =
      payload.eventData;

    if (!eventData) {
      return NextResponse.json(
        { received: true }
      );
    }

    /*
     * Monnify sends the payment reference in
     * eventData.paymentReference.
     */
    const reference =
      eventData.paymentReference;

    const transactionReference =
      eventData.transactionReference;

    if (!reference || !transactionReference) {
      console.error(
        "Webhook missing transaction references."
      );

      return NextResponse.json(
        { received: true }
      );
    }

    /*
     * Successful transaction.
     */
    if (
      eventType ===
        "SUCCESSFUL_TRANSACTION" ||
      eventType ===
        "SUCCESSFUL_TRANSACTION_NOTIFICATION"
    ) {
      const paymentMethod =
        eventData.paymentMethod ||
        eventData.paymentMethodCode;

      await convex.mutation(
        internal.donations.markPaid,
        {
          reference,
          monnifyTransactionRef:
            transactionReference,
          paymentMethod,
        }
      );
    }

    /*
     * Failed transaction.
     */
    if (
      eventType ===
        "FAILED_TRANSACTION"
    ) {
      await convex.mutation(
        internal.donations.markFailed,
        {
          reference,
        }
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Monnify webhook error:",
      error
    );

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
