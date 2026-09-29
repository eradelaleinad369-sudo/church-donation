"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InfoBar from "./components/InfoBar";
import About from "./components/About";
import GoalSection from "./components/GoalSection";
import ProgramSection from "./components/ProgramSection";
import MeetingsSection from "./components/MeetingsSection";
import DonateSection from "./components/DonateSection";
import PastEventsSection from "./components/PastEventsSection";
import GallerySection from "./components/GallerySection";
import LiveSection from "./components/LiveSection";
import Footer from "./components/Footer";

// Fallback used until the admin sets a real date in Settings.
const DEFAULT_EVENT_START = "2026-10-24T00:00:00+01:00";

export default function Home() {
  const settings = useQuery(api.settings.get);
  const eventStart = settings?.eventStart ?? DEFAULT_EVENT_START;

  return (
    <>
      <Header />
      <Hero eventStart={eventStart} />
      <InfoBar />
      <About />
      <GoalSection />
      <ProgramSection />
      <MeetingsSection />
      <DonateSection />
      <PastEventsSection />
      <GallerySection />
      <LiveSection />
      <Footer />
    </>
  );
}
