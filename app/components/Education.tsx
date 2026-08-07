"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "./SectionHeading";

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const degrees = [
  {
    degree: "Master of Science in Computer Science",
    school: "Columbia University",
    school2: "Fu Foundation School of Engineering and Applied Science",
    period: "Sep 2025 – May 2026",
    gpa: "4.1",
    highlights: [
      "Researcher in 2 CS labs",
      "Focus: Machine Learning, Computer Vision, Automated Theorem Proving",
    ],
  },
  {
    degree: "Bachelor of Arts in Computer Science",
    school: "Columbia University",
    school2: "Columbia College",
    period: "Sep 2021 – May 2025",
    gpa: "3.7",
    highlights: [
      "Dean's List",
      "Relevant coursework: Databases, High-Performance Computing, Machine Learning, Computer Vision, Natural Language Processing, Robotics, Analysis of Algorithms, Systems Programming, Computer Systems, Probability, Statistics",
    ],
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24 max-w-6xl mx-auto px-6">
      <SectionHeading title="Education" />

      <div className="grid md:grid-cols-2 gap-6">
        {degrees.map((d, i) => (
          <FadeIn key={d.degree} delay={i * 0.1}>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 hover:border-[#3b82f6]/30 transition-colors duration-300 h-full">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#3b82f6] font-mono tracking-widest uppercase mb-1">
                    {d.period}
                  </p>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#f1f5f9] text-lg leading-snug">
                    {d.degree}
                  </h3>
                  <p className="text-[#94a3b8] text-sm mt-1">{d.school}</p>
                  <p className="text-[#475569] text-xs mt-0.5">{d.school2}</p>
                </div>
              </div>

              <ul className="space-y-2">
                {d.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-[#94a3b8] leading-relaxed"
                  >
                    <span className="text-[#3b82f6] shrink-0">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
