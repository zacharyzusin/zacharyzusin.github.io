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

const skillGroups = [
  {
    label: "Programming Languages",
    icon: "{ }",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "SQL",
      "Java",
      "C",
      "R",
      "MATLAB",
      "Elixir",
      "Bash",
    ],
  },
  {
    label: "Machine Learning",
    icon: "⬡",
    items: [
      "PyTorch",
      "Scikit-Learn",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Computer Vision",
      "NLP",
      "Reinforcement Learning",
    ],
  },
  {
    label: "LLM & Agentic AI",
    icon: "✦",
    items: ["Transformers", "PEFT / LoRA", "vLLM", "AutoGen", "Ollama"],
  },
  {
    label: "Web & Backend",
    icon: "◈",
    items: ["Flask", "FastAPI", "React", "SQLAlchemy", "PostgreSQL", "Phoenix", "HTML", "CSS"],
  },
  {
    label: "Tools & Systems",
    icon: "⌘",
    items: ["Git", "Linux", "CUDA", "Bash"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Skills" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <FadeIn key={group.label} delay={i * 0.07}>
              <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6 hover:border-[#3b82f6]/30 transition-colors duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#3b82f6] font-mono text-lg">
                    {group.icon}
                  </span>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#f1f5f9] text-sm">
                    {group.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 bg-[#1e293b] text-[#94a3b8] rounded-full border border-[#1e293b] hover:border-[#3b82f6]/40 hover:text-[#f1f5f9] transition-all duration-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
