"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SchedulePage() {
  const items = useQuery(api.schedule.list) ?? [];
  const add = useMutation(api.schedule.add);
  const remove = useMutation(api.schedule.remove);

  const [day, setDay] = useState<"charity" | "main">("charity");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!time || !title) return;
    await add({ day, time, title, note: note || undefined, order: items.filter((i) => i.day === day).length });
    setTime(""); setTitle(""); setNote("");
  }

  return (
    <div>
      <h1>Schedule</h1>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0", alignItems: "center" }}>
        <select value={day} onChange={(e) => setDay(e.target.value as any)}>
          <option value="charity">Charity Day (24 Oct)</option>
          <option value="main">Main Event (25 Oct)</option>
        </select>
        <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time e.g. 9:00 AM" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" style={{ minWidth: 220 }} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" />
        <button type="submit">Add</button>
      </form>
      <table cellPadding={8} style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
        <thead><tr><th align="left">Day</th><th align="left">Time</th><th align="left">Title</th><th /></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id} style={{ borderTop: "1px solid #eee" }}>
              <td>{it.day === "charity" ? "Charity Day" : "Main Event"}</td>
              <td>{it.time}</td>
              <td>{it.title}</td>
              <td><button onClick={() => remove({ id: it._id })}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
