"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const modeLabel = { in_person: "In person", online: "Online", both: "In person and online" };

export default function MeetingsSection() {
  const meetings = useQuery(api.meetings.list) ?? [];
  return (
    <section id="meetings" className="alt">
      <div className="wrap">
        <p className="eyebrow">Prayer &amp; review meetings</p>
        <h2>Open to everyone</h2>
        <p className="lead">Join in person or online — set from the admin dashboard.</p>
        <ul className="mt">
          {(meetings.length ? meetings : [{ _id: "ph", date: "Date TBA", title: "No meetings scheduled yet", description: "Check back soon.", mode: "both" as const }]).map((m: any) => (
            <li key={m._id}>
              <span className="d">{m.date}</span>
              <div><strong>{m.title}</strong><p>{m.description}</p></div>
              <span className="tag">{modeLabel[m.mode as keyof typeof modeLabel]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
