import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const signature = req.headers.get("monnify-signature");
    const monnifySecret = process.env.MONNIFY_SECRET_KEY;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Missing WEBHOOK_SECRET.");

      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    if (signature && monnifySecret) {
      const expectedSignature = crypto
        .createHmac("sha512", monnifySecret)
        .update(rawBody)
        .digest("hex");

      const receivedBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        receivedBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(
          receivedBuffer,
          expectedBuffer
        )
      ) {
        console.error("Invalid Monnify webhook signature.");

        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);

    console.log("Monnify webhook received:", payload);

    const eventType = payload.eventType;
    const eventData = payload.eventData;

    if (!eventData) {
      return NextResponse.json({ received: true });
    }

    const reference = eventData.paymentReference;
    const transactionReference =
      eventData.transactionReference;

    if (!reference || !transactionReference) {
      console.error(
        "Webhook missing transaction references."
      );

      return NextResponse.json({ received: true });
    }

    if (
      eventType === "SUCCESSFUL_TRANSACTION" ||
      eventType ===
        "SUCCESSFUL_TRANSACTION_NOTIFICATION"
    ) {
      const paymentMethod =
        eventData.paymentMethod ||
        eventData.paymentMethodCode;

      await convex.mutation(api.donations.markPaid, {
        reference,
        monnifyTransactionRef: transactionReference,
        paymentMethod,
        secret: webhookSecret,
      });
    }

    if (eventType === "FAILED_TRANSACTION") {
      await convex.mutation(api.donations.markFailed, {
        reference,
        secret: webhookSecret,
      });
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Monnify webhook error:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
