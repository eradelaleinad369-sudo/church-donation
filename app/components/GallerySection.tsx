"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function GallerySection() {
  const photos = useQuery(api.gallery.list) ?? [];
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  const n = photos.length || 1;

  useEffect(() => {
    clearInterval(timer.current);

    if (photos.length > 1) {
      timer.current = setInterval(
        () => setI((x) => (x + 1) % n),
        4000
      );
    }

    return () => clearInterval(timer.current);
  }, [photos.length, n]);

  const current = photos[i];
  const next = photos[(i + 1) % n];

  return (
    <section id="gallery" className="alt">
      <div className="wrap">
        <h2>From past years</h2>

        <p
          className="lead"
          style={{ marginBottom: 20 }}
        >
          Photos uploaded from the admin dashboard play here.
        </p>

        <div
          className="slides"
          style={{
            position: "relative",
            aspectRatio: "16/9",
          }}
        >
          {current?.url ? (
            <Image
              src={current.url}
              alt={current.caption ?? ""}
              fill
              sizes="(max-width: 700px) 100vw, 700px"
              style={{
                objectFit: "cover",
                borderRadius: 10,
              }}
              priority
            />
          ) : (
            <div className="slide">
              Photo placeholder
            </div>
          )}

          {/* Preloaded off-screen so the next slide doesn't pop in blank */}
          {next?.url && next.url !== current?.url && (
            <div
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                opacity: 0,
              }}
            >
              <Image
                src={next.url}
                alt=""
                width={1}
                height={1}
              />
            </div>
          )}
        </div>

        <div className="dots">
          {(photos.length
            ? photos
            : [{ _id: "ph" }]
          ).map((p: any, k: number) => (
            <button
              key={p._id}
              type="button"
              aria-current={k === i}
              aria-label={`Show photo ${k + 1}`}
              onClick={() => setI(k)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
