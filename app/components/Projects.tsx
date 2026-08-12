"use client";

import { useRef, useState } from "react";
import { motion, useInView, useDragControls } from "framer-motion";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ProjectVisual from "./ProjectVisual";
import { projects, type Project } from "../lib/projects";

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(true);

  return (
      <div
        className="bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-hidden flex flex-col hover:border-[#3b82f6]/40 hover:shadow-lg hover:shadow-[#3b82f6]/5 transition-colors duration-300 group h-full select-none"
        onMouseMove={() => {
          setExpanded(true);
          setClamped(false);
        }}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => {
          setExpanded(true);
          setClamped(false);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setExpanded(false);
          }
        }}
      >
        {/* Signature live visualization */}
        <div className="relative h-24 w-full bg-[#0a0f1e] border-b border-[#1e293b]">
          <ProjectVisual type={project.visual} />
        </div>

        <div className="p-6 pt-5 flex flex-col flex-1">
        <h3 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#f1f5f9] mb-2 group-hover:text-[#93c5fd] transition-colors">
          {project.title}
        </h3>

        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : "4.3rem" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (!expanded) setClamped(true);
          }}
          className="overflow-hidden"
        >
          <p
            className={`text-sm text-[#94a3b8] leading-relaxed ${clamped ? "line-clamp-3" : ""}`}
          >
            {project.description}
          </p>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
            <div className="flex gap-2 mt-4">
              <Link
                href={`/projects/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium bg-[#3b82f6] text-white hover:bg-[#2563eb] rounded-md px-4 py-2.5 transition-colors"
              >
                View Details
              </Link>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="View on GitHub"
                className="flex items-center justify-center text-[#3b82f6] hover:text-white border border-[#3b82f6]/40 hover:bg-[#3b82f6] hover:border-[#3b82f6] rounded-md px-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
  );
}

// Splits items sequentially into `cols` groups (extra items biased to the
// earlier columns) rather than CSS `columns-N`, which rebalances which item
// lands in which column whenever a card's rendered height changes (e.g. the
// hover-expand animation) — that reflow is what read as a card teleporting.
// Assignment here is fixed at render time and never depends on layout.
function chunkIntoColumns<T>(items: T[], cols: number): T[][] {
  const perCol = Math.ceil(items.length / cols);
  return Array.from({ length: cols }, (_, c) => items.slice(c * perCol, (c + 1) * perCol));
}

function DesktopColumns({ cols, className }: { cols: number; className: string }) {
  const columns = chunkIntoColumns(projects, cols);
  return (
    <div className={`${className} gap-5`}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex-1 flex flex-col gap-5">
          {col.map((project, i) => (
            <FadeIn key={project.title} delay={(ci + i) * 0.05}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      ))}
    </div>
  );
}

function MobileCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        ref={ref}
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ right: 0, left: -(projects.length * 272 - (typeof window !== "undefined" ? window.innerWidth - 48 : 320)) }}
        dragElastic={0.1}
        className="flex gap-4 pb-4"
        style={{ width: projects.length * 272 }}
      >
        {projects.map((project) => (
          <div key={project.title} className="w-64 shrink-0">
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-6">
      <SectionHeading title="Projects" />

      {/* Desktop masonry — explicit column arrays (see chunkIntoColumns)
          rather than CSS columns-N, so a card expanding on hover can't
          shuffle which column any card belongs to. */}
      <DesktopColumns cols={2} className="hidden md:flex lg:hidden" />
      <DesktopColumns cols={3} className="hidden lg:flex" />

      {/* Mobile carousel */}
      <div className="md:hidden">
        <MobileCarousel />
        <p className="text-xs text-[#475569] text-center mt-4">drag to scroll</p>
      </div>
    </section>
  );
}
