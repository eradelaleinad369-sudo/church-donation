"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../AdminTokenProvider";

export default function SettingsPage() {
  const adminToken = useAdminToken()!;
  const settings = useQuery(api.settings.get);
  const save = useMutation(api.settings.upsert);

  const [targetNGN, setTargetNGN] = useState(5000000);
  const [targetUSD, setTargetUSD] = useState(3300);
  const [ytUrl, setYtUrl] = useState("");
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [eventStart, setEventStart] = useState("2026-10-24T00:00:00+01:00");

  useEffect(() => {
    if (settings) {
      setTargetNGN(settings.donationTargetNGN);
      setTargetUSD(settings.donationTargetUSD);
      setYtUrl(settings.youtubeLiveUrl ?? "");
      setLiveEnabled(settings.liveEnabled);
      setEventStart(settings.eventStart);
    }
  }, [settings]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await save({ donationTargetNGN: targetNGN, donationTargetUSD: targetUSD, youtubeLiveUrl: ytUrl || undefined, liveEnabled, eventStart, adminToken });
    alert("Saved.");
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>Settings</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>Event start (used by the countdown)
          <input value={eventStart} onChange={(e) => setEventStart(e.target.value)} placeholder="2026-10-24T00:00:00+01:00" style={inputStyle} />
        </label>
        <label>Donation target — Naira
          <input type="number" value={targetNGN} onChange={(e) => setTargetNGN(Number(e.target.value))} style={inputStyle} />
        </label>
        <label>Donation target — US dollars
          <input type="number" value={targetUSD} onChange={(e) => setTargetUSD(Number(e.target.value))} style={inputStyle} />
        </label>
        <label>YouTube live link
          <input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={liveEnabled} onChange={(e) => setLiveEnabled(e.target.checked)} />
          Show the live stream on the site now
        </label>
        <button type="submit" style={{ padding: 12, background: "#0F2A4A", color: "#fff", border: 0, borderRadius: 6 }}>Save</button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = { display: "block", width: "100%", padding: 10, marginTop: 4, border: "1px solid #ccc", borderRadius: 6 };