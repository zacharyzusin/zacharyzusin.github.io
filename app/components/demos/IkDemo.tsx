"use client";

import { useRef, useState, useCallback } from "react";

// Real 2-link (2R) planar inverse kinematics — the same math the repo's
// hand-engineered reference controller uses to convert a desired foot
// position into hip/knee joint angles.
const THIGH = 90; // px, link 1 length
const SHIN = 90; // px, link 2 length
const HIP = { x: 200, y: 40 };

function solveIK(targetX: number, targetY: number) {
  const dx = targetX - HIP.x;
  const dy = targetY - HIP.y;
  let dist = Math.hypot(dx, dy);
  const maxReach = THIGH + SHIN - 1;
  const minReach = Math.abs(THIGH - SHIN) + 1;
  const clamped = Math.min(Math.max(dist, minReach), maxReach);
  const scale = clamped / (dist || 1);
  const cx = HIP.x + dx * scale;
  const cy = HIP.y + dy * scale;
  dist = clamped;

  // Law of cosines for the knee angle
  const cosKnee = (THIGH * THIGH + SHIN * SHIN - dist * dist) / (2 * THIGH * SHIN);
  const kneeAngle = Math.acos(Math.min(1, Math.max(-1, cosKnee)));

  const hipToTarget = Math.atan2(cy - HIP.y, cx - HIP.x);
  const cosA = (THIGH * THIGH + dist * dist - SHIN * SHIN) / (2 * THIGH * dist);
  const a = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const hipAngle = hipToTarget - a;

  const kneeX = HIP.x + THIGH * Math.cos(hipAngle);
  const kneeY = HIP.y + THIGH * Math.sin(hipAngle);

  return {
    knee: { x: kneeX, y: kneeY },
    foot: { x: cx, y: cy },
    hipAngleDeg: (hipAngle * 180) / Math.PI,
    // Interior angle at the knee: 180° = fully extended (straight leg),
    // smaller values = more flexed — the standard joint-angle convention.
    kneeAngleDeg: (kneeAngle * 180) / Math.PI,
  };
}

export default function IkDemo() {
  const [target, setTarget] = useState({ x: 220, y: 220 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const solution = solveIK(target.x, target.y);

  const updateFromEvent = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 400;
    const y = ((clientY - rect.top) / rect.height) * 260;
    setTarget({ x, y });
  }, []);

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-4">
        The same 2-link inverse kinematics the hand-engineered reference controller uses to
        convert a desired foot position into hip and knee joint angles. Drag the foot target.
      </p>

      <svg
        ref={svgRef}
        viewBox="0 0 400 260"
        className="w-full max-w-md mx-auto touch-none cursor-grab active:cursor-grabbing bg-[#0a0f1e] rounded-md border border-[#1e293b]"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as Element).setPointerCapture(e.pointerId);
          updateFromEvent(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (dragging.current) updateFromEvent(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        {/* ground */}
        <line x1="0" y1="250" x2="400" y2="250" stroke="#1e293b" strokeWidth={1.5} />
        {/* thigh */}
        <line
          x1={HIP.x}
          y1={HIP.y}
          x2={solution.knee.x}
          y2={solution.knee.y}
          stroke="#3b82f6"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* shin */}
        <line
          x1={solution.knee.x}
          y1={solution.knee.y}
          x2={solution.foot.x}
          y2={solution.foot.y}
          stroke="#93c5fd"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* hip joint */}
        <circle cx={HIP.x} cy={HIP.y} r={7} fill="#f1f5f9" />
        {/* knee joint */}
        <circle cx={solution.knee.x} cy={solution.knee.y} r={6} fill="#f1f5f9" />
        {/* foot / target */}
        <circle
          cx={solution.foot.x}
          cy={solution.foot.y}
          r={9}
          fill="#0a0f1e"
          stroke="#3b82f6"
          strokeWidth={2.5}
        />
      </svg>

      <div className="flex justify-center gap-8 mt-4 text-xs font-mono">
        <span className="text-[#94a3b8]">
          hip: <span className="text-[#3b82f6]">{solution.hipAngleDeg.toFixed(1)}°</span>
        </span>
        <span className="text-[#94a3b8]">
          knee: <span className="text-[#3b82f6]">{solution.kneeAngleDeg.toFixed(1)}°</span>
        </span>
      </div>
    </div>
  );
}
