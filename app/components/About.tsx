"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
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


export default function About() {
  return (
    <section id="about" className="py-24 max-w-3xl mx-auto px-6 text-center">
      <FadeIn>
        <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl text-[#f1f5f9] mb-8">
          About Me
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="text-[#94a3b8] leading-relaxed mb-10">
          I&apos;m a CS graduate from Columbia University (BA &apos;25, MS &apos;26).
          My work is in machine learning research — across two labs at Columbia,
          one in vision-language models and one in automated theorem proving.
          I also interned as a software engineer at PayPal.
          Outside of that, I fence on Columbia&apos;s NCAA Division I team and
          build autonomous vehicles with the Robotics Club.
        </p>
      </FadeIn>

    </section>
  );
}
