"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function GallerySection() {
  const photos = useQuery(api.gallery.list) ?? [];
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const n = photos.length || 1;

  useEffect(() => {
    clearInterval(timer.current);
    if (photos.length > 1) timer.current = setInterval(() => setI((x) => (x + 1) % n), 4000);
    return () => clearInterval(timer.current);
  }, [photos.length, n]);

  return (
    <section id="gallery" className="alt">
      <div className="wrap">
        <h2>From past years</h2>
        <p className="lead" style={{ marginBottom: 20 }}>Photos uploaded from the admin dashboard play here.</p>
        <div className="slides">
          <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
            {(photos.length ? photos : [{ _id: "ph", url: null, caption: "Photo placeholder" }]).map((p: any) => (
              <div className="slide" key={p._id}>
                {p.url ? <img src={p.url} alt={p.caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "Photo placeholder"}
              </div>
            ))}
          </div>
        </div>
        <div className="dots">
          {(photos.length ? photos : [{ _id: "ph" }]).map((p: any, k: number) => (
            <button key={p._id} type="button" aria-current={k === i} aria-label={`Show photo ${k + 1}`} onClick={() => setI(k)} />
          ))}
        </div>
      </div>
    </section>
  );
}
