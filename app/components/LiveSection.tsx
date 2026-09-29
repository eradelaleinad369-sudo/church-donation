"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function toEmbedUrl(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function LiveSection() {
  const settings = useQuery(api.settings.get);
  const live = settings?.liveEnabled && settings.youtubeLiveUrl;

  return (
    <section id="live">
      <div className="wrap">
        <h2>Watch live</h2>
        <p className="lead">Can't be there? Follow the main event on YouTube.</p>
        {live ? (
          <div style={{ aspectRatio: "16/9", borderRadius: 10, overflow: "hidden" }}>
            <iframe src={toEmbedUrl(settings!.youtubeLiveUrl!)} title="Live stream" allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }} />
          </div>
        ) : (
          <div className="live">
            <div>
              <p>The stream link will appear here once it's turned on from the admin dashboard.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
