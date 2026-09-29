"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProgramSection() {
  const items = useQuery(api.schedule.list) ?? [];
  const charity = items.filter((i) => i.day === "charity");
  const main = items.filter((i) => i.day === "main");

  return (
    <section id="program">
      <div className="wrap">
        <p className="eyebrow">The program</p>
        <h2>Two days, one purpose</h2>
        <p className="lead">We begin by serving children in orphanage homes, then gather for the main program.</p>
        <div className="days">
          <div className="day">
            <h3>Saturday 24 October: Charity Day</h3>
            <p className="sub">Visit to orphanage homes</p>
            <ul className="tl">
              {(charity.length ? charity : [{ time: "Time to be added", title: "Schedule not yet set", _id: "ph1" }]).map((it: any) => (
                <li key={it._id}><time>{it.time}</time>{it.title}{it.note ? <><br /><small>{it.note}</small></> : null}</li>
              ))}
            </ul>
          </div>
          <div className="day">
            <h3>Sunday 25 October: Main Event</h3>
            <p className="sub">At the church, 1A Amusa Street</p>
            <ul className="tl">
              {(main.length ? main : [{ time: "Time to be added", title: "Schedule not yet set", _id: "ph2" }]).map((it: any) => (
                <li key={it._id}><time>{it.time}</time>{it.title}{it.note ? <><br /><small>{it.note}</small></> : null}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="note">Managed from the admin dashboard — updates here appear on the site instantly.</p>
      </div>
    </section>
  );
}
