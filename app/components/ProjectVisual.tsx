"use client";

import { useEffect, useRef } from "react";

export type VisualType =
  | "waveform"
  | "hierarchy"
  | "timeseries"
  | "clusters"
  | "tree"
  | "postag"
  | "ngram"
  | "cky"
  | "ingredients"
  | "regression"
  | "reps"
  | "walker"
  | "pipeline";

const ACCENT = "#3b82f6";
const ACCENT_LIGHT = "#93c5fd";
const MUTED = "#334155";

// ---- individual draw routines (ctx, width, height, time seconds) -----------

function waveform(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bars = 40;
  const bw = w / bars;
  for (let i = 0; i < bars; i++) {
    const amp =
      (Math.sin(i * 0.5 + t * 4) * 0.5 + 0.5) *
      (Math.sin(i * 0.2 + t) * 0.4 + 0.6);
    const bh = 4 + amp * (h * 0.7);
    ctx.fillStyle = i % 3 === 0 ? ACCENT_LIGHT : ACCENT;
    ctx.globalAlpha = 0.5 + amp * 0.5;
    ctx.fillRect(i * bw + 1, (h - bh) / 2, bw - 2, bh);
  }
  ctx.globalAlpha = 1;
}

function hierarchy(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const root = { x: w / 2, y: h * 0.12 };
  const mid = { x: w / 2, y: h * 0.38 };
  const leaves = [
    { x: w * 0.16, y: h * 0.68, label: "Bird" },
    { x: w * 0.5, y: h * 0.68, label: "Dog" },
    { x: w * 0.84, y: h * 0.68, label: "Reptile" },
  ];
  const activeIdx = Math.floor(t * 0.7) % leaves.length;
  const activeLeaf = leaves[activeIdx];

  // base tree edges
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(root.x, root.y);
  ctx.lineTo(mid.x, mid.y);
  leaves.forEach((l) => {
    ctx.moveTo(mid.x, mid.y);
    ctx.lineTo(l.x, l.y);
  });
  ctx.stroke();

  // highlighted decision path down to the active class
  ctx.strokeStyle = ACCENT_LIGHT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(root.x, root.y);
  ctx.lineTo(mid.x, mid.y);
  ctx.lineTo(activeLeaf.x, activeLeaf.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(root.x, root.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mid.x, mid.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();

  ctx.textAlign = "center";
  leaves.forEach((l, i) => {
    const active = i === activeIdx;
    ctx.beginPath();
    ctx.arc(l.x, l.y, active ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = active ? ACCENT_LIGHT : ACCENT;
    ctx.fill();

    ctx.font = "600 9px monospace";
    ctx.fillStyle = active ? ACCENT_LIGHT : "#64748b";
    ctx.fillText(l.label, l.x, l.y + 15);
  });
  ctx.textAlign = "left";
}

function timeseries(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Behavioral-state timeline (Still/Move/WheelTurn/Groom) + a wheel-velocity
  // trace underneath — the actual DAART-style visualization this project
  // produces, not a generic set of sine waves.
  const states = [MUTED, ACCENT, ACCENT_LIGHT, "#6366f1"]; // still, move, wheel turn, groom
  const barY = h * 0.24;
  const barH = h * 0.22;
  const segCount = 14;
  const segW = w / segCount;
  for (let i = 0; i < segCount; i++) {
    const phase = i * 1.7 - t * 1.6;
    const stateIdx = Math.floor(((Math.sin(phase) * 0.5 + 0.5) ** 1.6) * states.length);
    ctx.fillStyle = states[Math.min(stateIdx, states.length - 1)];
    ctx.globalAlpha = 0.9;
    ctx.fillRect(i * segW + 0.5, barY, segW - 1, barH);
  }
  ctx.globalAlpha = 1;

  // wheel-velocity-style trace below
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const y = h * 0.66 + Math.sin((x / w) * Math.PI * 5 + t * 2.6) * h * 0.1 * (0.4 + 0.6 * Math.sin(x * 0.05 + t));
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = ACCENT_LIGHT;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.9;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function clusters(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // 5 clusters, matching the real k=5 optimum the silhouette-score sweep
  // finds for this dataset — not an arbitrary round number.
  const cx = w / 2;
  const cy = h * 0.54;
  const R = Math.min(w, h) * 0.32;
  const palette = [ACCENT, ACCENT_LIGHT, "#6366f1", ACCENT, ACCENT_LIGHT];
  const centers = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.82, c: palette[i] };
  });
  centers.forEach((ct, ci) => {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + t * 0.5 + ci;
      const rad = 5 + ((i * 3 + ci * 5) % 10);
      const x = ct.x + Math.cos(a) * rad;
      const y = ct.y + Math.sin(a) * rad;
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = ct.c;
      ctx.globalAlpha = 0.85;
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}

function tree(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // A dependency-parse arc diagram — tokens along a baseline connected by
  // curved head→dependent arcs — the standard way this specific task
  // (not a generic top-down tree) is visualized, and one arc is built up
  // at a time, echoing the parser's own shift-reduce transitions.
  const n = 5;
  const baseline = h * 0.64;
  const margin = w * 0.1;
  const xs = Array.from({ length: n }, (_, i) => margin + (i / (n - 1)) * (w - margin * 2));

  const arcs: [number, number, number][] = [
    [0, 1, 0.45],
    [1, 3, 1.0],
    [2, 3, 0.4],
    [3, 4, 0.7],
  ];
  const cycle = Math.floor(t * 1.1) % (arcs.length + 1);

  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin * 0.5, baseline);
  ctx.lineTo(w - margin * 0.5, baseline);
  ctx.stroke();

  arcs.forEach(([a, b, height], idx) => {
    const built = idx < cycle;
    const building = idx === cycle;
    if (!built && !building) return;
    const x1 = xs[Math.min(a, b)];
    const x2 = xs[Math.max(a, b)];
    const midX = (x1 + x2) / 2;
    const arcH = baseline - height * h * 0.46;
    ctx.strokeStyle = building ? ACCENT_LIGHT : ACCENT;
    ctx.lineWidth = building ? 2.2 : 1.4;
    ctx.globalAlpha = built ? 0.55 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, baseline);
    ctx.quadraticCurveTo(midX, arcH, x2, baseline);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const headX = xs[b];
    ctx.fillStyle = building ? ACCENT_LIGHT : ACCENT;
    ctx.beginPath();
    ctx.moveTo(headX, baseline + 1);
    ctx.lineTo(headX - 3, baseline - 5);
    ctx.lineTo(headX + 3, baseline - 5);
    ctx.closePath();
    ctx.fill();
  });

  xs.forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, baseline, 3, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT;
    ctx.fill();
  });
}

function postag(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const words = ["The", "cat", "sat", "on", "the", "mat"];
  const tags = ["DT", "NN", "VB", "IN", "DT", "NN"];
  const n = words.length;
  const gap = 6;
  const bw = (w - gap * (n + 1)) / n;
  const active = Math.floor(t * 1.4) % n;
  const y = h * 0.55;
  const bh = h * 0.24;

  // The real model convolves a kernel over a 4-token context window rather
  // than tagging one word in isolation — shown here as a sliding bracket.
  const windowSpan = 4;
  const slidePositions = n - windowSpan + 1;
  const winStart = Math.floor(t * 0.6) % slidePositions;
  const winX = gap + winStart * (bw + gap) - 3;
  const winW = windowSpan * (bw + gap) - gap + 6;
  ctx.strokeStyle = ACCENT_LIGHT;
  ctx.globalAlpha = 0.7;
  ctx.setLineDash([3, 2]);
  ctx.lineWidth = 1;
  ctx.strokeRect(winX, y - 10, winW, bh + 16);
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  for (let i = 0; i < n; i++) {
    const x = gap + i * (bw + gap);
    const isActive = i === active;

    ctx.fillStyle = ACCENT;
    ctx.globalAlpha = isActive ? 0.85 : 0.3;
    ctx.fillRect(x, y, bw, bh);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "600 9px monospace";
    ctx.fillText(words[i], x + bw / 2, y + bh / 2 + 3);

    if (isActive) {
      ctx.fillStyle = ACCENT_LIGHT;
      ctx.font = "700 9px monospace";
      ctx.fillText(tags[i], x + bw / 2, y - 12);
    }
  }
  ctx.textAlign = "left";
}

function ngram(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const boxes = 3;
  const gap = 10;
  const bw = (w * 0.7 - gap * (boxes - 1)) / boxes;
  const oy = h * 0.38;
  const bh = h * 0.24;
  const shift = (t * 0.6) % 1;
  for (let i = 0; i < boxes; i++) {
    const x = i * (bw + gap);
    ctx.fillStyle = ACCENT;
    ctx.globalAlpha = 0.5 + 0.5 * Math.max(0, 1 - Math.abs(i - shift * boxes));
    ctx.fillRect(x, oy, bw, bh);
    if (i < boxes - 1) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = MUTED;
      ctx.beginPath();
      ctx.moveTo(x + bw, oy + bh / 2);
      ctx.lineTo(x + bw + gap, oy + bh / 2);
      ctx.stroke();
    }
  }
  // predicted next token
  const px = boxes * (bw + gap);
  ctx.globalAlpha = 0.4 + 0.6 * (Math.sin(t * 3) * 0.5 + 0.5);
  ctx.fillStyle = ACCENT_LIGHT;
  ctx.fillRect(px, oy, bw, bh);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = ACCENT_LIGHT;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(px, oy, bw, bh);
  ctx.setLineDash([]);
}

function cky(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const n = 5;
  const size = Math.min(w, h) * 0.8;
  const cell = size / n;
  const ox = (w - size) / 2;
  const oy = (h - size) / 2;
  let filled = 0;
  const totalCells = (n * (n + 1)) / 2;
  const progress = Math.floor((t * 3) % (totalCells + 4));
  for (let row = n; row >= 1; row--) {
    for (let col = 0; col < row; col++) {
      const x = ox + col * cell + ((n - row) * cell) / 2;
      const y = oy + (n - row) * cell;
      const on = filled < progress;
      ctx.strokeStyle = MUTED;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cell - 2, cell - 2);
      if (on) {
        ctx.fillStyle = ACCENT;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(x, y, cell - 2, cell - 2);
        ctx.globalAlpha = 1;
      }
      filled++;
    }
  }
}

function ingredients(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const emojis = ["🍅", "🥕", "🧀", "🥬", "🥚", "🌶️"];
  const funnelY = h * 0.36;

  // funnel — ingredients narrow down to what fits the filters
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.24, funnelY - 8);
  ctx.lineTo(w * 0.5, funnelY + 10);
  ctx.lineTo(w * 0.76, funnelY - 8);
  ctx.stroke();

  // recipe card — where the matching ingredients land
  const cardW = w * 0.56;
  const cardH = h * 0.32;
  const cardX = (w - cardW) / 2;
  const cardY = h - cardH - 6;
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  const n = emojis.length;
  ctx.font = `${Math.round(h * 0.16)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < n; i++) {
    const phase = (t * 0.4 + i / n) % 1;
    const passes = i % 2 === 0; // matches the recipe's filters
    const startX = w * (0.3 + (i / n) * 0.4);
    const y = phase * h * 0.88;

    if (!passes && y > funnelY) continue; // filtered out — doesn't match

    let x = startX;
    if (passes && y > funnelY) {
      const settle = Math.min(1, (y - funnelY) / (h * 0.5));
      x = startX + (w / 2 - startX) * settle;
    }

    ctx.globalAlpha = 0.95;
    ctx.fillText(emojis[i], x, y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function regression(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const pts = [
    [0.1, 0.75],
    [0.22, 0.68],
    [0.34, 0.6],
    [0.46, 0.55],
    [0.58, 0.44],
    [0.7, 0.4],
    [0.82, 0.3],
    [0.9, 0.24],
  ];
  // slightly wobbling fit line
  const slope = -0.55 + Math.sin(t) * 0.05;
  const intercept = 0.8 + Math.sin(t * 0.7) * 0.03;
  ctx.strokeStyle = ACCENT_LIGHT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, intercept * h);
  ctx.lineTo(w, (intercept + slope) * h);
  ctx.stroke();
  pts.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p[0] * w, p[1] * h, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT;
    ctx.fill();
  });
}

function reps(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // A body silhouette with muscle-group zones lighting up in sequence —
  // the app's actual distinguishing feature (highlightBodyPart(), gating
  // the quiz behind full coverage), not a generic barbell.
  const cx = w / 2;
  const activeIdx = Math.floor(t * 1.0) % 4; // chest, arms, core, legs
  // Scale horizontal measurements off height, not width — this canvas is a
  // wide banner, and a human figure's width should track its own height,
  // not an arbitrary wide aspect ratio.
  const s = h;

  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, h * 0.15, h * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.15, h * 0.26);
  ctx.lineTo(cx - s * 0.17, h * 0.58);
  ctx.lineTo(cx - s * 0.09, h * 0.62);
  ctx.lineTo(cx - s * 0.09, h * 0.92);
  ctx.moveTo(cx + s * 0.15, h * 0.26);
  ctx.lineTo(cx + s * 0.17, h * 0.58);
  ctx.lineTo(cx + s * 0.09, h * 0.62);
  ctx.lineTo(cx + s * 0.09, h * 0.92);
  ctx.stroke();

  function zone(x: number, y: number, ww: number, hh: number, idx: number) {
    const active = idx === activeIdx;
    ctx.fillStyle = active ? ACCENT_LIGHT : ACCENT;
    ctx.globalAlpha = active ? 0.9 : 0.22;
    ctx.fillRect(x, y, ww, hh);
    ctx.globalAlpha = 1;
  }
  zone(cx - s * 0.13, h * 0.24, s * 0.26, h * 0.16, 0); // chest
  zone(cx - s * 0.23, h * 0.26, s * 0.06, h * 0.22, 1); // left arm
  zone(cx + s * 0.17, h * 0.26, s * 0.06, h * 0.22, 1); // right arm
  zone(cx - s * 0.11, h * 0.42, s * 0.22, h * 0.16, 2); // core
  zone(cx - s * 0.09, h * 0.6, s * 0.075, h * 0.3, 3); // left leg
  zone(cx + s * 0.015, h * 0.6, s * 0.075, h * 0.3, 3); // right leg
}

function walker(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Modeled on the actual 3D-printed biped: blocky servo-housing segments
  // and a flat rectangular board mounted on top (the Arduino Uno), rather
  // than a generic thin stick-figure walker.
  const groundY = h * 0.86;
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  const hipX = w * 0.14 + ((t * 22) % (w * 0.72));
  const hipY = h * 0.46;
  const seg = h * 0.15;
  const segW = Math.max(3, h * 0.05);
  const stride = t * 5;

  function block(x1: number, y1: number, x2: number, y2: number, color: string, thickness: number) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const len = Math.hypot(x2 - x1, y2 - y1);
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, len, thickness, Math.min(2, thickness / 2));
    ctx.fill();
    ctx.restore();
  }

  [0, Math.PI].forEach((phase, i) => {
    const swing = Math.sin(stride + phase) * 0.6;
    const bend = Math.max(0, Math.sin(stride + phase + Math.PI / 2)) * 0.9;
    const kneeX = hipX + Math.sin(swing) * seg;
    const kneeY = hipY + Math.cos(swing) * seg;
    const footX = kneeX + Math.sin(swing - bend) * seg;
    const footY = kneeY + Math.cos(swing - bend) * seg;
    const color = i === 0 ? ACCENT_LIGHT : ACCENT;

    block(hipX, hipY, kneeX, kneeY, color, segW);
    block(kneeX, kneeY, footX, footY, color, segW * 0.85);

    // knee servo housing
    ctx.fillStyle = MUTED;
    ctx.fillRect(kneeX - segW * 0.5, kneeY - segW * 0.5, segW, segW);

    // foot block
    ctx.fillStyle = color;
    ctx.fillRect(footX - segW * 0.7, footY - segW * 0.32, segW * 1.4, segW * 0.7);
  });

  // torso block
  const torsoW = segW * 1.5;
  const torsoH = h * 0.2;
  const torsoY = hipY - torsoH - segW * 0.4;
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.roundRect(hipX - torsoW / 2, torsoY, torsoW, torsoH, 1.5);
  ctx.fill();

  // flat rectangular "head" board (the mounted microcontroller)
  const headW = torsoW * 2.1;
  const headH = h * 0.15;
  ctx.fillStyle = ACCENT_LIGHT;
  ctx.beginPath();
  ctx.roundRect(hipX - headW / 2, torsoY - headH - 2, headW, headH, 1.5);
  ctx.fill();
}

function pipeline(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // The actual data path ported into FMS: raw audio -> Conformer encoder ->
  // Q-Former projector -> LLM decoder -> text. The frame around all four
  // stages solidifying and glowing represents torch.compile tracing them
  // into one fused graph instead of four separate eager calls.
  const stages = ["Audio", "Encoder", "Projector", "LLM"];
  const n = stages.length;
  const gap = w * 0.04;
  const bw = (w - gap * (n - 1)) / n;
  const y = h * 0.36;
  const bh = h * 0.22;
  const xs = Array.from({ length: n }, (_, i) => i * (bw + gap));

  const cycle = (t * 0.5) % 1;
  const activeIdx = Math.min(n - 1, Math.floor(cycle * n));
  const compiled = Math.sin(t * 1.1) > 0;

  const pad = 7;
  ctx.strokeStyle = compiled ? ACCENT_LIGHT : MUTED;
  ctx.lineWidth = compiled ? 1.6 : 1;
  ctx.globalAlpha = compiled ? 0.85 : 0.45;
  if (!compiled) ctx.setLineDash([3, 3]);
  ctx.strokeRect(-pad, y - pad, w + pad * 2, bh + pad * 2);
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const isActive = i === activeIdx;

    ctx.fillStyle = ACCENT;
    ctx.globalAlpha = isActive ? 0.85 : 0.32;
    ctx.fillRect(x, y, bw, bh);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#f1f5f9";
    ctx.font = isActive ? "700 8px monospace" : "600 8px monospace";
    ctx.fillText(stages[i], x + bw / 2, y + bh / 2 + 3);

    if (i < n - 1) {
      ctx.strokeStyle = MUTED;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + bw + 2, y + bh / 2);
      ctx.lineTo(xs[i + 1] - 2, y + bh / 2);
      ctx.stroke();
    }
  }
  ctx.textAlign = "left";

  // A small, distinct moving element under each stage, hinting at what that
  // stage actually does rather than just decorating it. Sized off `uh` (not
  // fixed pixels) so it holds up at both the card's small preview height and
  // the project page's much taller one.
  const uy = y + bh + 14;
  const uh = Math.max(10, h - uy - 6);
  for (let i = 0; i < n; i++) {
    const ux = xs[i];

    if (i === 0) {
      // Audio: the raw input waveform.
      ctx.strokeStyle = ACCENT_LIGHT;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      for (let px = 0; px <= bw; px += 3) {
        const amp = Math.sin(px * 0.6 + t * 6) * 0.5 + 0.5;
        const yy = uy + uh / 2 + Math.sin(px * 0.4) * amp * (uh * 0.4);
        if (px === 0) ctx.moveTo(ux + px, yy);
        else ctx.lineTo(ux + px, yy);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (i === 1) {
      // Encoder: a scanning window "reads" a row of feature bars — the
      // Conformer's local conv/attention receptive field moving across the
      // sequence. Bars under the window light up brighter than the rest so
      // the window and what it's "looking at" read as one connected idea,
      // not two independent animations.
      const bars = 6;
      const bbw = bw / bars;
      const winPos = (t * 0.9) % (bars - 1); // window spans [winPos, winPos+2)
      for (let b = 0; b < bars; b++) {
        const covered = b >= winPos && b < winPos + 2;
        const barH = uh * (0.3 + 0.3 * (Math.sin(b * 1.3 + t * 2) * 0.5 + 0.5));
        ctx.fillStyle = covered ? ACCENT_LIGHT : ACCENT;
        ctx.globalAlpha = covered ? 0.9 : 0.35;
        ctx.fillRect(ux + b * bbw + 1, uy + uh - barH, bbw - 2, barH);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ACCENT_LIGHT;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.8;
      ctx.strokeRect(ux + winPos * bbw, uy, bbw * 2, uh);
      ctx.globalAlpha = 1;
    } else if (i === 2) {
      // Projector: many encoder-timestep features compress down into a
      // handful of query tokens. Small dots enter from the left (many
      // inputs) and flow rightward into 2 fixed collector points (few
      // outputs), which pulse as dots arrive — a "many merge into few"
      // read that also keeps the same left-to-right flow as the rest of
      // the pipeline, instead of an unrelated top-to-bottom motion.
      const dots = 6;
      const collectors = [ux + bw * 0.78, ux + bw * 0.94];
      const collectorY = uy + uh * 0.5;
      for (let d = 0; d < dots; d++) {
        const phase = (t * 0.5 + d / dots) % 1;
        const startX = ux + 2;
        const startY = uy + ((d % 3) / 2) * uh;
        const targetX = collectors[d % collectors.length];
        const px = startX + (targetX - startX) * phase;
        const py = startY + (collectorY - startY) * phase;
        ctx.beginPath();
        ctx.arc(px, py, 2 * (1 - phase * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = ACCENT_LIGHT;
        ctx.globalAlpha = 0.85 * (1 - phase * 0.3);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const cxCollector of collectors) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 3 + cxCollector);
        ctx.beginPath();
        ctx.arc(cxCollector, collectorY, 2.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT_LIGHT;
        ctx.globalAlpha = 0.4 + pulse * 0.4;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      // LLM: generated output tokens appearing one at a time.
      const maxTokens = 5;
      const shown = Math.floor((t * 1.6) % (maxTokens + 1));
      const tokw = (bw - 2 * (maxTokens - 1)) / maxTokens;
      for (let k = 0; k < shown; k++) {
        const isNewest = k === shown - 1;
        ctx.fillStyle = isNewest ? ACCENT_LIGHT : ACCENT;
        ctx.globalAlpha = isNewest ? 0.9 : 0.5;
        ctx.fillRect(ux + k * (tokw + 2), uy + uh * 0.35, tokw, uh * 0.3);
      }
      ctx.globalAlpha = 1;
    }
  }
}

const RENDERERS: Record<VisualType, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  waveform,
  hierarchy,
  timeseries,
  clusters,
  tree,
  postag,
  ngram,
  cky,
  ingredients,
  regression,
  reps,
  walker,
  pipeline,
};

export default function ProjectVisual({ type }: { type: VisualType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    const start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      RENDERERS[type](ctx, w, h, t);
      raf = requestAnimationFrame(loop);
    };

    // Respect reduced-motion: draw a single static frame, no loop
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      RENDERERS[type](ctx, canvas.offsetWidth, canvas.offsetHeight, 0.5);
      return () => window.removeEventListener("resize", resize);
    }

    // Only animate while visible
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [type]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
