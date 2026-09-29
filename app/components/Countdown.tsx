"use client";
import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// eventStart is an ISO string, e.g. "2026-10-24T00:00:00+01:00" (Lagos time).
export default function Countdown({ eventStart }: { eventStart: string }) {
  const [left, setLeft] = useState({ d: "--", h: "--", m: "--", s: "--" });

  useEffect(() => {
    const target = new Date(eventStart).getTime();
    function tick() {
      const t = Math.max(0, target - Date.now());
      const s = Math.floor(t / 1000);
      setLeft({
        d: String(Math.floor(s / 86400)),
        h: pad(Math.floor((s % 86400) / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
        s: pad(s % 60),
      });
    }
    tick(); // starts counting immediately on mount, no waiting for the first tick
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventStart]);

  return (
    <div className="bigcd" role="timer" aria-label="Time until Youth Day begins">
      <div><b>{left.d}</b><span>Days</span></div>
      <div><b>{left.h}</b><span>Hours</span></div>
      <div><b>{left.m}</b><span>Minutes</span></div>
      <div><b>{left.s}</b><span>Seconds</span></div>
    </div>
  );
}
