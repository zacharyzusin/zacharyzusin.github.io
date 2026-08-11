"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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


const experiences = [
  {
    title: "Software Engineer Intern",
    org: "PayPal",
    location: "New York, NY",
    period: "May 2026 – Aug 2026",
    type: "industry",
    bullets: [],
  },
  {
    title: "Graduate Researcher",
    org: "Software Systems Lab, Columbia University",
    location: "New York, NY",
    period: "Sep 2025 – May 2026",
    type: "research",
    bullets: [
      "Developed a framework for fine-tuning vision-language models for classification tasks with high intra-class diversity",
      "Enabled automatic discovery of meaningful sub-categories, improving detection of complex visual variations",
    ],
  },
  {
    title: "Graduate Researcher",
    org: "Zemel Group, Columbia University",
    location: "New York, NY",
    period: "Sep 2025 – May 2026",
    type: "research",
    bullets: [
      "Investigated new methods for automated theorem proving, leveraging complexity theory and machine learning",
      "Created new representations of mathematical theorems and proof techniques to be better understood by ML models",
      "Constructed techniques to quantify theorem difficulty and integrate real and synthetic data into model training",
    ],
  },
  {
    title: "Undergraduate Researcher",
    org: "Zuckerman Mind Brain and Behavior Institute, Columbia University",
    location: "New York, NY",
    period: "Jun 2024 – Aug 2024",
    type: "research",
    bullets: [
      "Implemented a diagnostic pipeline in Python to evaluate the efficacy of Temporal Convolutional Network models in classifying mouse behavior",
      "Analyzed multi-modal time-series data (wheel velocity, paw locations, etc.) to validate models' behavioral predictions",
    ],
  },
];

function ColumbiaIcon() {
  return (
    <Image
      src="/logos/columbia.svg"
      alt="Columbia University"
      width={26}
      height={20}
      className="w-[26px] h-auto"
    />
  );
}

function PayPalIcon() {
  return (
    <Image src="/logos/paypal.svg" alt="PayPal" width={20} height={20} className="w-5 h-5" />
  );
}

function OrgBadge({ org }: { org: string }) {
  const isColumbia = org.includes("Columbia");
  const isPayPal = org.includes("PayPal");
  if (!isColumbia && !isPayPal) return null;
  return (
    <div className="shrink-0 w-9 h-9 rounded-lg border border-[#3b82f6]/40 bg-[#0a0f1e] flex items-center justify-center">
      {isColumbia ? <ColumbiaIcon /> : <PayPalIcon />}
    </div>
  );
}

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Experience" />

        <div className="relative" ref={timelineRef}>
          {/* Timeline track */}
          <div className="absolute left-0 md:left-6 top-0 bottom-0 w-px bg-[#1e293b]" />
          {/* Scroll-driven fill */}
          <motion.div
            style={{ scaleY: lineScale, originY: 0 }}
            className="absolute left-0 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#3b82f6] to-[#6366f1]"
          />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="relative pl-8 md:pl-20">
                  {/* Dot */}
                  <div className="absolute left-[-5px] md:left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3b82f6] border-2 border-[#0a0f1e]" />

                  <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 hover:border-[#3b82f6]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3b82f6]/10 transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <OrgBadge org={exp.org} />
                        <div>
                          <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#f1f5f9] text-lg">
                            {exp.title}
                          </h3>
                          <p className="text-[#3b82f6] text-sm mt-0.5">
                            {exp.org}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs text-[#475569]">
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {exp.bullets.length > 0 && (
                      <ul className="space-y-2 mt-3">
                        {exp.bullets.map((b, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-[#94a3b8] leading-relaxed"
                          >
                            <span className="text-[#3b82f6] shrink-0">
                              ▹
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.bullets.length === 0 && (
                      <p className="text-sm text-[#475569] italic mt-1">
                        Details coming soon.
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
