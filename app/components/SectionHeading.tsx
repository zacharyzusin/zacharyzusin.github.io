"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ title }: { title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowX, setGlowX] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setGlowX(((e.clientX - left) / width) * 100);
  };

  const handleMouseLeave = () => setGlowX(null);

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 mb-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl text-[#f1f5f9] whitespace-nowrap">
        {title}
      </h2>
      <div className="relative flex-1 h-px bg-[#1e293b] overflow-visible">
        <motion.div
          animate={{
            opacity: glowX !== null ? 1 : 0,
            scaleX: glowX !== null ? 1 : 0.3,
          }}
          transition={{ duration: 0.2 }}
          style={{ originX: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#3b82f6]/60 to-transparent"
        />
      </div>
    </div>
  );
}
