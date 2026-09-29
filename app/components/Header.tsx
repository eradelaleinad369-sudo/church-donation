"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Header() {
  const images = useQuery(api.siteImages.get);
  const logo = images?.logo;

  return (
    <header className="top">
      <div className="wrap">
        <div className="brand">
          {logo ? (
            <img src={logo} alt="Church logo" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <span className="mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                <path d="M12 2v20M4 8h16" />
              </svg>
            </span>
          )}
          <b>Mafoluku Youth Day</b>
        </div>
        <nav className="mainnav">
          <a className="active" href="#top">Home</a>
          <a href="#about">About the Event</a>
          <a href="#program">Program</a>
          <a href="#donate">Donate</a>
          <a href="#footer">Contact</a>
        </nav>
        <a className="btn" href="#donate" style={{ padding: "9px 20px" }}>Donate Now →</a>
      </div>
    </header>
  );
}