// Server-side helpers for verifying a Monnify transaction directly with
// Monnify's API. NEVER trust the browser redirect alone — always verify here.

const BASE = process.env.MONNIFY_BASE_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_MONNIFY_API_KEY as string;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY as string;

async function getAccessToken() {
  const creds = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString("base64");
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { Authorization: `Basic ${creds}` },
  });
  const data = await res.json();
  return data.responseBody.accessToken as string;
}

export async function verifyMonnifyTransaction(paymentReference: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE}/api/v2/transactions/${encodeURIComponent(paymentReference)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  // data.responseBody.paymentStatus is "PAID", "PENDING", "OVERPAID", "FAILED", etc.
  return data.responseBody as {
    paymentStatus: string;
    transactionReference: string;
    paymentReference: string;
    amountPaid: number;
  };
}
