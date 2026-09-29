"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function fmt(n: number, currency: "NGN" | "USD") {
  const sym = currency === "NGN" ? "₦" : "$";
  return sym + n.toLocaleString();
}

export default function GoalSection() {
  const settings = useQuery(api.settings.get);
  const totals = useQuery(api.donations.totals);

  const target = settings?.donationTargetNGN ?? 5000000;
  const raised = totals?.NGN ?? 0;
  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const donorCount = totals?.donorCount ?? 0;

  const daysLeft = settings?.eventStart
    ? Math.max(0, Math.ceil((new Date(settings.eventStart).getTime() - Date.now()) / 86400000))
    : "--";

  const breakdown = [
    { label: "Charity Day", desc: "Gifts and outreach to orphanage homes", share: 0 },
    { label: "Venue & Logistics", desc: "Sound, seating and event essentials", share: 0 },
    { label: "Youth Ministry", desc: "Resources for ongoing youth programs", share: 0 },
    { label: "Community Outreach", desc: "Extending the event's impact beyond the church", share: 0 },
  ];

  return (
    <section className="alt">
      <div className="wrap" style={{ maxWidth: 1180 }}>
        <p className="eyebrow">Our goal</p>
        <h2 style={{ marginBottom: 6 }}>Every Gift Moves Us Closer</h2>
        <p className="lead" style={{ marginBottom: 36 }}>
          Here's where we stand, and exactly where your gift goes.
        </p>
        <div className="goal2">
          <div>
            <div className="amt">{fmt(raised, "NGN")}</div>
            <div style={{ color: "var(--muted)" }}>raised of {fmt(target, "NGN")} target</div>
            <div className="bar2"><i style={{ width: `${pct}%` }} /></div>
            <div className="statrow">
              <div><b>{daysLeft}</b><span>Days left to give</span></div>
              <div><b>{donorCount}</b><span>Donors so far</span></div>
            </div>
            <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>
              Figures update automatically from confirmed Monnify payments only.
            </span>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Where your gift goes</p>
            <div className="breakdown">
              {breakdown.map((b) => (
                <div className="brow" key={b.label}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <circle cx="9" cy="8" r="3" />
                  </svg>
                  <div>
                    <b>{b.label}</b>
                    <span>{b.desc}</span>
                    <div className="mbar"><i style={{ width: `${b.share}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
