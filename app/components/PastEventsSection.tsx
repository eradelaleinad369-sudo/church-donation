"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PastEventsSection() {
  const events = useQuery(api.pastEvents.list) ?? [];
  return (
    <section id="past">
      <div className="wrap">
        <h2>Past events</h2>
        <p className="lead">Youth Day has been held every year, except 2020.</p>
        <div className="past">
          {(events.length ? events : [{ _id: "ph", year: "—", summary: "No past events added yet. Add them from the admin dashboard.", attendance: undefined }]).map((ev: any) => (
            <details key={ev._id}>
              <summary>{ev.year} <span>{ev.attendance ? `${ev.attendance} attended` : "Attendance to be added"}</span></summary>
              <p>{ev.summary}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
