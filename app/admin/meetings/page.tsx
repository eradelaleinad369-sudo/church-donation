"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAdminToken } from "../AdminTokenProvider";

export default function MeetingsPage() {
  const adminToken = useAdminToken()!;
  const meetings = useQuery(api.meetings.list) ?? [];
  const add = useMutation(api.meetings.add);
  const remove = useMutation(api.meetings.remove);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [mode, setMode] = useState<"in_person" | "online" | "both">("both");
  const [location, setLocation] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [description, setDescription] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date || !description) return;
    await add({ title, date, mode, location: location || undefined, onlineLink: onlineLink || undefined, description, adminToken });
    setTitle(""); setDate(""); setLocation(""); setOnlineLink(""); setDescription("");
  }

  return (
    <div>
      <h1>Prayer &amp; Review Meetings</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 420, margin: "16px 0" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title e.g. Prayer meeting" />
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date/time e.g. 12 Oct 2026, 6pm" />
        <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="in_person">In person</option>
          <option value="online">Online</option>
          <option value="both">In person and online</option>
        </select>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (if in person)" />
        <input value={onlineLink} onChange={(e) => setOnlineLink(e.target.value)} placeholder="Online link (if online)" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        <button type="submit">Add meeting</button>
      </form>
      <ul>
        {meetings.map((m) => (
          <li key={m._id} style={{ marginBottom: 8 }}>
            <b>{m.date}</b> — {m.title} ({m.mode}) <button onClick={() => remove({ id: m._id, adminToken })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}