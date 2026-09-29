"use client";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const PRESETS = { NGN: [5000, 10000, 50000], USD: [10, 25, 100] } as const;
const SYM = { NGN: "₦", USD: "$" } as const;

const VERSES = [
  { t: "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.", c: "2 Corinthians 9:7" },
  { t: "Honour the LORD with thy substance, and with the firstfruits of all thine increase. So shall thy barns be filled with plenty, and thy presses shall burst out with new wine.", c: "Proverbs 3:9-10" },
  { t: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.", c: "Malachi 3:10" },
  { t: "A poor widow's small offering, given from all she had, meant more than the large gifts of the wealthy.", c: "Mark 12:41-44" },
  { t: "God is a Spirit: and they that worship him must worship him in spirit and in truth.", c: "John 4:24" },
  { t: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.", c: "Romans 12:1" },
];

export default function DonateSection() {
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("Online payments are coming soon.");
  const [verseIdx, setVerseIdx] = useState(0);
  const createPending = useMutation(api.donations.createPending);

  useEffect(() => {
    const id = setInterval(() => setVerseIdx((i) => (i + 1) % VERSES.length), 6000);
    return () => clearInterval(id);
  }, []);

  async function handleDonate() {
    const val = parseFloat(amount);
    if (!val || val <= 0) return setMsg("Please choose or enter an amount first.");
    if (!email) return setMsg("Please enter an email address for your receipt.");
    const reference = `YD2026-${Date.now()}`;
    await createPending({ reference, amount: val, currency, donorName: name || undefined, donorEmail: email });
    setMsg("Thank you! Online payments are being finalised — we'll be in touch, or check back soon.");
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
              {VERSES[verseIdx].c}
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
