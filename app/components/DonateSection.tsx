"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

declare global {
  interface Window { MonnifySDK?: any }
}

const PRESETS = { NGN: [5000, 10000, 50000], USD: [10, 25, 100] } as const;
const SYM = { NGN: "₦", USD: "$" } as const;

const VERSES = [
  { t: "Give cheerfully and from the heart, not out of pressure.", c: "2 Corinthians 9:7" },
  { t: "Honor the Lord with the first and best of what you have, and your resources will overflow.", c: "Proverbs 3:9-10" },
  { t: "Bring your offering in full, and see how God pours out more blessing than you have room for.", c: "Malachi 3:10" },
  { t: "A poor widow's small offering, given from all she had, meant more than the large gifts of the wealthy.", c: "Mark 12:41-44" },
  { t: "True worshippers are the ones who worship the Father in spirit and in truth.", c: "John 4:23-24" },
  { t: "Offer your whole self to God as a living sacrifice — that is true and proper worship.", c: "Romans 12:1" },
];

export default function DonateSection() {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("Payments are processed securely by Monnify.");
  const [verseIdx, setVerseIdx] = useState(0);
  const sdkLoaded = useRef(false);
  const createPending = useMutation(api.donations.createPending);

  useEffect(() => {
    const id = setInterval(() => setVerseIdx((i) => (i + 1) % VERSES.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (sdkLoaded.current) return;
    const s = document.createElement("script");
    s.src = "https://sdk.monnify.com/plugin/monnify.js";
    s.async = true;
    s.onload = () => { sdkLoaded.current = true; };
    document.body.appendChild(s);
  }, []);

  async function handleDonate() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return setMsg("Please choose or enter an amount first.");
    if (!email) return setMsg("Please enter an email address for your receipt.");
    const reference = `YD2026-${Date.now()}`;

    await createPending({ reference, amount: val, currency, donorName: name || undefined, donorEmail: email });

    if (!window.MonnifySDK) {
      setMsg("Payment system is still loading — please try again in a moment.");
      return;
    }

    window.MonnifySDK.initialize({
      amount: val,
      currency,
      reference,
      customerEmail: email,
      customerName: name || "Guest",
      apiKey: process.env.NEXT_PUBLIC_MONNIFY_API_KEY,
      contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE,
      paymentDescription: "Youth Day 2026 donation",
      onLoadStart: () => {},
      onLoadComplete: () => {},
      onComplete: () => {
        // Monnify's webhook is the source of truth for whether this actually succeeded —
        // this callback only tells the donor their browser session finished.
        setMsg("Thank you! We're confirming your payment now.");
      },
      onClose: () => {},
    });
  }

  return (
    <section id="donate">
      <div className="give2">
        <div>
          <p className="eyebrow">Make your contribution</p>
          <h2>Be a Part of Something Greater</h2>
          <p className="lead">Your gift covers the charity day, the venue, and everything needed for Youth Day.</p>
          <div className="seg" role="group" aria-label="Currency" style={{ maxWidth: 280 }}>
            {(["NGN", "USD"] as const).map((c) => (
              <button key={c} type="button" aria-pressed={currency === c}
                onClick={() => { setCurrency(c); setAmount(""); }}>
                {c === "NGN" ? "Naira (₦)" : "US dollar ($)"}
              </button>
            ))}
          </div>
          <div className="amtrow">
            {PRESETS[currency].map((v) => (
              <button key={v} type="button" aria-pressed={amount === String(v)} onClick={() => setAmount(String(v))}>
                {SYM[currency]}{v.toLocaleString()}
              </button>
            ))}
          </div>
          <div style={{ maxWidth: 420 }}>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric"
              placeholder="Or enter another amount" aria-label="Donation amount"
              style={{ width: "100%", padding: 12, border: "1.5px solid var(--line)", borderRadius: 6, marginBottom: 12, font: "1rem var(--sans)", color: "var(--ink)" }} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" aria-label="Your name"
              style={{ width: "100%", padding: 12, border: "1.5px solid var(--line)", borderRadius: 6, marginBottom: 12, font: "1rem var(--sans)", color: "var(--ink)" }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email for your receipt" aria-label="Email"
              style={{ width: "100%", padding: 12, border: "1.5px solid var(--line)", borderRadius: 6, marginBottom: 14, font: "1rem var(--sans)", color: "var(--ink)" }} />
            <button className="btn" type="button" onClick={handleDonate}>Donate Now →</button>
            <small style={{ display: "block", marginTop: 10, color: "var(--muted)" }}>{msg}</small>
          </div>
        </div>
        <div className="quotebox" style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: 28 }}>
          <svg className="cross" viewBox="0 0 100 140" aria-hidden="true">
            <rect x="42" y="0" width="16" height="140" fill="var(--navy)" />
            <rect x="10" y="35" width="80" height="16" fill="var(--navy)" />
          </svg>
          <div className="versewrap">
            <blockquote className="verse" style={{ marginTop: 26, transition: "opacity .25s ease" }} key={verseIdx}>
              {VERSES[verseIdx].t}
              <cite>{VERSES[verseIdx].c}</cite>
            </blockquote>
            <div className="dots" style={{ justifyContent: "flex-start", marginTop: 10 }}>
              {VERSES.map((_, i) => (
                <button key={i} type="button" aria-current={i === verseIdx} aria-label={`Show verse ${i + 1}`} onClick={() => setVerseIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
