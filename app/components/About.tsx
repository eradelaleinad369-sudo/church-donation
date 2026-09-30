"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function About() {
  const images = useQuery(api.siteImages.get);
  const photo = images?.about_photo;

  return (
    <section id="about">
      <div className="about2">
        <div>
          <p className="eyebrow">About the event</p>
          <h2>A Time to Seek God, Grow Together</h2>
          <p className="lead" style={{ margin: "14px 0 22px" }}>
            Youth Day brings members, guests and visitors together for two days: Saturday's outreach
            to orphanage homes, and Sunday's main program of worship, teaching and fellowship. It's a
            chance to seek God, be refreshed, and support the ministries that make this possible.
          </p>
          <a className="learn" href="#program">See the full program →</a>
        </div>
        {photo ? (
          <div className="ph" style={{ position: "relative", border: "none", padding: 0, overflow: "hidden" }}>
            <Image src={photo} alt="Youth Day" fill sizes="(max-width: 820px) 100vw, 500px" style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <div className="ph">Event photo placeholder</div>
        )}
      </div>
    </section>
  );
}