import { NextRequest, NextResponse } from "next/server";

const MONNIFY_BASE_URL =
  process.env.MONNIFY_BASE_URL ||
  "https://sandbox.monnify.com";

const MONNIFY_API_KEY =
  process.env.MONNIFY_API_KEY;

const MONNIFY_SECRET_KEY =
  process.env.MONNIFY_SECRET_KEY;

const MONNIFY_CONTRACT_CODE =
  process.env.MONNIFY_CONTRACT_CODE;

export async function POST(req: NextRequest) {
  try {
    if (
      !MONNIFY_API_KEY ||
      !MONNIFY_SECRET_KEY ||
      !MONNIFY_CONTRACT_CODE
    ) {
      console.error(
        "Missing Monnify environment variables."
      );

      return NextResponse.json(
        {
          error:
            "Payment service is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      reference,
      amount,
      currency,
      donorName,
      donorEmail,
    } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    if (!donorEmail) {
      return NextResponse.json(
        { error: "Donor email is required." },
        { status: 400 }
      );
    }

    // First authenticate with Monnify.
    const authString = Buffer.from(
      `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`
    ).toString("base64");

    const authResponse = await fetch(
      `${MONNIFY_BASE_URL}/api/v1/auth/login`,
      {
        method: "POST",

        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },

        cache: "no-store",
      }
    );

    const authData = await authResponse.json();

    if (
      !authResponse.ok ||
      !authData.requestSuccessful
    ) {
      console.error(
        "Monnify authentication failed:",
        authData
      );

      return NextResponse.json(
        {
          error:
            "Unable to connect to payment service.",
        },
        { status: 502 }
      );
    }

    const accessToken =
      authData.responseBody?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Payment service did not return an access token.",
        },
        { status: 502 }
      );
    }

    const paymentPayload = {
      amount,
      customerName:
        donorName || "Youth Day Donor",
      customerEmail: donorEmail,

      paymentReference: reference,

      paymentDescription:
        "Youth Day Donation",

      currencyCode: currency || "NGN",

      contractCode:
        MONNIFY_CONTRACT_CODE,

      redirectUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/donate/payment-complete`,

      paymentMethods: [
        "CARD",
        "ACCOUNT_TRANSFER",
        "USSD",
        "PHONE_NUMBER",
        "PAY_WITH_BANK",
      ],
    };

    const paymentResponse = await fetch(
      `${MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(paymentPayload),

        cache: "no-store",
      }
    );

    const paymentData =
      await paymentResponse.json();

    if (
      !paymentResponse.ok ||
      !paymentData.requestSuccessful
    ) {
      console.error(
        "Monnify transaction initialization failed:",
        paymentData
      );

      return NextResponse.json(
        {
          error:
            paymentData.responseMessage ||
            "Unable to initialize payment.",
        },
        { status: 502 }
      );
    }

    const checkoutUrl =
      paymentData.responseBody?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        {
          error:
            "Monnify did not return a checkout URL.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl,
      transactionReference:
        paymentData.responseBody
          ?.transactionReference,
    });
  } catch (error) {
    console.error(
      "Payment initialization error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while starting the payment.",
      },
      { status: 500 }
    );
  }
}
