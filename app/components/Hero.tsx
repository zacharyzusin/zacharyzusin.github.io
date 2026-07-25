"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import MagneticIcon from "./MagneticIcon";

const TYPING_TEXT =
  "Columbia CS graduate. Software engineer. Machine learning researcher.";

function TypingSubtitle() {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= TYPING_TEXT.length) return;
    const timeout = setTimeout(() => {
      setDisplayed(TYPING_TEXT.slice(0, displayed.length + 1));
    }, 40);
    return () => clearTimeout(timeout);
  }, [started, displayed]);

  return (
    <p className="font-[family-name:var(--font-space-grotesk)] font-semibold text-xl text-[#94a3b8] mb-10 min-h-[1.75rem]">
      {displayed}
      <span className="inline-block w-0.5 h-5 bg-[#3b82f6] ml-0.5 align-middle animate-pulse" />
    </p>
  );
}


const socials = [
  {
    label: "GitHub",
    href: "https://github.com/zacharyzusin",
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zachary-zusin/",
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:zacharyzusin@gmail.com",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
    >
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        <div className="flex-1 relative min-w-0">
          {/* Blue glow — centered behind the name, subtitle, and buttons */}
          <div className="absolute -z-10 -left-8 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-[family-name:var(--font-space-grotesk)] font-bold text-5xl sm:text-6xl md:text-7xl text-[#f1f5f9] leading-tight mb-4"
        >
          Zach Zusin.
        </motion.h1>

        <TypingSubtitle />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex items-center gap-8"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-[#3b82f6] text-white rounded font-medium text-sm hover:bg-[#2563eb] transition-colors duration-200"
          >
            See My Work
          </a>

          <div className="flex items-center gap-5">
            {socials.map((s) => (
              <MagneticIcon key={s.label} href={s.href} label={s.label}>
                {s.icon}
              </MagneticIcon>
            ))}
          </div>
        </motion.div>
        </div>

        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="shrink-0 flex justify-center md:justify-end"
        >
          <div className="relative w-52 h-52 md:w-64 md:h-64">
            {/* Rotating gradient ring */}
            <div className="absolute inset-0 rounded-full animate-spin [animation-duration:4s] bg-[conic-gradient(from_0deg,#3b82f6,#1e293b,#3b82f6)] p-[3px]">
              <div className="w-full h-full rounded-full bg-[#0a0f1e]" />
            </div>
            {/* Photo — resolves from blurred to sharp */}
            <motion.div
              initial={{ filter: "blur(20px)", scale: 1.1, opacity: 0 }}
              animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
              className="absolute inset-[3px] rounded-full overflow-hidden"
            >
              <Image
                src="/photo.jpeg"
                alt="Zachary Zusin"
                width={256}
                height={256}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
