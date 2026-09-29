import type { Metadata } from "next";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Life Of True Worship – Youth Day 2026",
  description:
    "Youth Day 2026: A Life Of True Worship, 24–25 October 2026, 1A Amusa Street, Mafoluku-Oshodi, Lagos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
