"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Countdown from "./Countdown";

export default function Hero({ eventStart }: { eventStart: string }) {
  const images = useQuery(api.siteImages.get);
  const bg = images?.hero_background;

  return (
    <section
      className="hero2"
      id="top"
      style={bg ? { backgroundImage: `linear-gradient(100deg, rgba(15,42,74,.88) 30%, rgba(15,42,74,.55) 68%, rgba(15,42,74,.15) 100%), url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {!bg && (
        <svg className="art" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="500" height="600" fill="#0c2140" />
          <circle cx="380" cy="150" r="120" fill="#1b3f68" opacity=".6" />
          <rect x="200" y="120" width="26" height="300" fill="#13294a" />
          <rect x="120" y="220" width="180" height="26" fill="#13294a" />
        </svg>
      )}
      <div className="wrap">
        <p className="eyebrow" style={{ color: "var(--gold)" }}>Youth Day 2026</p>
        <h1>A Life Of<br />True Worship</h1>
        <p className="lead2">
        "But the hour cometh, and now is, 
        when the true worshippers shall worship the Father in spirit and in truth:
         for the Father seeketh such to worship him." (John 4:23)
        </p>
        <Countdown eventStart={eventStart} />
        <div className="row">
          <a className="btn" href="#donate">Donate Now →</a>
          <a className="btn ghost" href="#program">See the Program</a>
        </div>
      </div>
    </section>
  );
}