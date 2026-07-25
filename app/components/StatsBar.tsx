"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "MS + BA", label: "Columbia University" },
  { value: "2×", label: "Ivy League Champion" },
  { value: "2", label: "Research Labs" },
  { value: "13", label: "Projects" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="border-y border-[#1e293b] bg-[#0f172a]">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl text-[#3b82f6]">
              {stat.value}
            </p>
            <p className="text-xs text-[#94a3b8] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
