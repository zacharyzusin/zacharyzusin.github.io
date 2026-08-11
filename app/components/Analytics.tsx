"use client";

import { useEffect } from "react";
import { isConfigured, recordEngagement, recordVisit } from "../lib/visitors";

// Keep in sync with the section ids rendered in page.tsx.
const SECTION_IDS = [
  "hero",
  "experience",
  "education",
  "projects",
  "skills",
  "visitors",
];

export default function Analytics() {
  useEffect(() => {
    if (!isConfigured()) return;

    recordVisit();

    const startedAt = Date.now();
    const viewedSections = new Set<string>();
    let maxScrollPct = 0;

    const trackScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const pct = doc.scrollHeight > 0 ? (scrolled / doc.scrollHeight) * 100 : 0;
      maxScrollPct = Math.max(maxScrollPct, Math.min(100, Math.round(pct)));
    };
    trackScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            viewedSections.add(entry.target.id);
          }
        }
      },
      { threshold: 0.4 }
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const send = () => {
      recordEngagement({
        timeOnPageSeconds: Math.round((Date.now() - startedAt) / 1000),
        maxScrollPct,
        sectionsViewed: Array.from(viewedSections),
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") send();
    };

    window.addEventListener("scroll", trackScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", send);

    return () => {
      window.removeEventListener("scroll", trackScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", send);
      observer.disconnect();
    };
  }, []);

  return null;
}
