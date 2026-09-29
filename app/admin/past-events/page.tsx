"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function PastEventsPage() {
  const events = useQuery(api.pastEvents.list) ?? [];
  const add = useMutation(api.pastEvents.add);
  const remove = useMutation(api.pastEvents.remove);
  const generateUploadUrl = useMutation(api.pastEvents.generateUploadUrl);

  const [year, setYear] = useState(2025);
  const [theme, setTheme] = useState("");
  const [attendance, setAttendance] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary) return;
    const photoIds: Id<"_storage">[] = [];
    if (files) {
      for (const file of Array.from(files)) {
        const url = await generateUploadUrl();
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
        const { storageId } = await res.json();
        photoIds.push(storageId);
      }
    }
    await add({ year, theme: theme || undefined, attendance: attendance ? Number(attendance) : undefined, summary, photoIds });
    setTheme(""); setAttendance(""); setSummary(""); setFiles(null);
  }

  return (
    <div>
      <h1>Past Events</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 420, margin: "16px 0" }}>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" />
        <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Theme (optional)" />
        <input type="number" value={attendance} onChange={(e) => setAttendance(e.target.value)} placeholder="Attendance (optional)" />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary / outcomes / testimonies" />
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
        <button type="submit">Add past event</button>
      </form>
      <ul>
        {events.map((ev) => (
          <li key={ev._id} style={{ marginBottom: 8 }}>
            <b>{ev.year}</b> — {ev.summary.slice(0, 60)}... ({ev.photoIds.length} photos) <button onClick={() => remove({ id: ev._id })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
