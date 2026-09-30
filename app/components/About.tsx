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
            A Life of True Worship is a special gathering centered on 
            discovering and living out what it truly means to worship God.
           Through an expository Bible study on “The Pattern of True Worship” 
           from John 4:23–24 and Acts 16:22–34, we will explore worship that 
           goes beyond words and outward expressions to a genuine life devoted to God.
           The programme will include a worship-themed song service, prayers,
           testimonies, Gospel outreach, and charity outreach—creating 
           an opportunity to learn, worship, share, serve, and reach others with the love of Christ.
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