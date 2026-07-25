"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "../lib/projects";
import ProjectVisual from "./ProjectVisual";
import CkyDemo from "./demos/CkyDemo";
import TrigramDemo from "./demos/TrigramDemo";
import RegressionDemo from "./demos/RegressionDemo";
import IkDemo from "./demos/IkDemo";
import ParserDemo from "./demos/ParserDemo";
import ClusteringDemo from "./demos/ClusteringDemo";
import SsmTaggerDemo from "./demos/SsmTaggerDemo";

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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ImageLightbox({
  images,
}: {
  images: NonNullable<Project["images"]>;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className={`grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {images.map((img, i) => (
          <figure
            key={img.src}
            className="rounded-lg overflow-hidden border border-[#1e293b] bg-[#0a0f1e] cursor-zoom-in group"
            onClick={() => setOpen(i)}
          >
            <div className="overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={500}
                unoptimized={img.src.endsWith(".gif")}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            {img.caption && (
              <figcaption className="text-xs text-[#475569] px-3 py-2 border-t border-[#1e293b]">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-4xl w-full"
            >
              <Image
                src={images[open].src}
                alt={images[open].alt}
                width={1400}
                height={900}
                unoptimized={images[open].src.endsWith(".gif")}
                className="w-full h-auto rounded-lg border border-[#1e293b]"
              />
              {images[open].caption && (
                <p className="text-sm text-[#94a3b8] text-center mt-4">
                  {images[open].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TechnicalDeepDive({ items }: { items: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 2);

  return (
    <section className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div>
          <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#f1f5f9] mb-1">
            Technical Deep-Dive
          </h2>
          <p className="text-xs text-[#475569]">
            Architecture and implementation specifics.
          </p>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#3b82f6] shrink-0 ml-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>

      <ul className="space-y-2.5 mt-4">
        {visible.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2 text-sm text-[#94a3b8] leading-relaxed"
          >
            <span className="text-[#3b82f6] shrink-0 mt-0.5 font-mono text-xs">▹</span>
            {t}
          </li>
        ))}
      </ul>

      {!expanded && items.length > 2 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-[#3b82f6] hover:text-[#93c5fd] transition-colors mt-3 cursor-pointer"
        >
          Show {items.length - 2} more →
        </button>
      )}
    </section>
  );
}

const DEMOS: Record<string, React.ComponentType> = {
  "cky-parser": CkyDemo,
  "trigram-language-model": TrigramDemo,
  "life-expectancy-analysis": RegressionDemo,
  "bipedal-locomotion": IkDemo,
  "neural-dependency-parser": ParserDemo,
  "wikipedia-article-clustering": ClusteringDemo,
  "pos-tagger-state-space-model": SsmTaggerDemo,
};

export default function ProjectPageContent({ project }: { project: Project }) {
  const Demo = DEMOS[project.slug];

  // The site's <html> has scroll-smooth for in-page anchor nav (the section
  // links, "Back to Projects"), but that also makes the browser's own
  // scroll-to-top-on-navigation animate instead of jump — so opening a
  // project page while scrolled down on the homepage visibly scrolls back
  // up. An explicit `behavior: "instant"` here overrides the CSS setting
  // for just this jump.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <FadeIn>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#3b82f6] transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Link>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="relative h-56 sm:h-64 w-full rounded-lg overflow-hidden bg-[#0a0f1e] border border-[#1e293b] mb-8">
            <ProjectVisual type={project.visual} />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-3xl sm:text-4xl text-[#f1f5f9] mb-3">
            {project.title}
          </h1>

          <p className="text-[#94a3b8] text-lg leading-relaxed mb-6">
            {project.short}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 bg-[#1e293b] text-[#94a3b8] rounded-full border border-[#1e293b]"
              >
                {t}
              </span>
            ))}
          </div>
        </FadeIn>

        <div className="space-y-10">
          <FadeIn>
            <section>
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#3b82f6] mb-3">
                The Problem
              </h2>
              <p className="text-[#94a3b8] leading-relaxed">{project.problem}</p>
            </section>
          </FadeIn>

          <FadeIn>
            <section>
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#3b82f6] mb-3">
                The Approach
              </h2>
              <p className="text-[#94a3b8] leading-relaxed">{project.approach}</p>
            </section>
          </FadeIn>

          {Demo && (
            <FadeIn>
              <section>
                <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#3b82f6] mb-3">
                  Try It Live
                </h2>
                <Demo />
              </section>
            </FadeIn>
          )}

          {project.images && project.images.length > 0 && (
            <FadeIn>
              <section>
                <ImageLightbox images={project.images} />
              </section>
            </FadeIn>
          )}

          {project.technical && project.technical.length > 0 && (
            <FadeIn>
              <TechnicalDeepDive items={project.technical} />
            </FadeIn>
          )}

          <FadeIn>
            <section>
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#3b82f6] mb-3">
                Highlights
              </h2>
              <ul className="space-y-2">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-[#94a3b8] leading-relaxed"
                  >
                    <span className="text-[#3b82f6] shrink-0">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>

          {project.results && (
            <FadeIn>
              <section>
                <h2 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-lg text-[#3b82f6] mb-3">
                  Results
                </h2>
                <p className="text-[#94a3b8] leading-relaxed">{project.results}</p>
              </section>
            </FadeIn>
          )}
        </div>

        <FadeIn>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-12 px-6 py-3 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-[#2563eb] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </FadeIn>
      </div>
    </main>
  );
}
