"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../AdminTokenProvider";

const SLOTS = [
  { key: "hero_background", label: "Hero background image", hint: "Shown behind the homepage headline. A wide photo works best." },
  { key: "about_photo", label: "About the Event photo", hint: "Shown next to the About the Event text." },
  { key: "logo", label: "Church logo", hint: "Shown in the header and footer." },
];

export default function MediaPage() {
  const adminToken = useAdminToken()!;
  const images = useQuery(api.siteImages.get);
  const generateUploadUrl = useMutation(api.siteImages.generateUploadUrl);
  const setSlot = useMutation(api.siteImages.setSlot);
  const [busy, setBusy] = useState<string | null>(null);

  async function onUpload(slot: string, file: File) {
    setBusy(slot);
    const url = await generateUploadUrl({ adminToken });
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    await setSlot({ slot, storageId, adminToken });
    setBusy(null);
  }

  return (
    <div>
      <h1>Site Images</h1>
      <p>Upload or replace the background and photos used across the site.</p>
      <div style={{ display: "grid", gap: 24, marginTop: 20, maxWidth: 480 }}>
        {SLOTS.map((s) => (
          <div key={s.key} style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
            <b>{s.label}</b>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0 10px" }}>{s.hint}</p>
            {images?.[s.key] && (
              <img src={images[s.key]!} alt={s.label} style={{ width: "100%", borderRadius: 6, marginBottom: 10 }} />
            )}
            <input type="file" accept="image/*" disabled={busy === s.key}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(s.key, f); e.target.value = ""; }} />
            {busy === s.key && <span style={{ marginLeft: 8 }}>Uploading…</span>}
          </div>
        ))}
      </div>
    </div>
  );
}