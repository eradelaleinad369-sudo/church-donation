import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function icon() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
  const images = await convex.query(api.siteImages.get, {});
  const logoUrl = images?.logo;

  if (logoUrl) {
    const res = await fetch(logoUrl);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      return new Response(buf, {
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/png",
          "Cache-Control": "public, max-age=300",
        },
      });
    }
  }

  // Fallback shown only if no logo has been uploaded yet
  return new ImageResponse(
    (
      <div style={{ fontSize: 22, background: "#0F2A4A", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37" }}>
        †
      </div>
    ),
    { width: 32, height: 32 }
  );
}