"use client";

import { useEffect, useState } from "react";

// Real article titles from the actual pipeline (wikigraph_v8.py) — same 5
// categories, same title list. The repo scrapes and embeds these live and
// never persists the fitted 2D coordinates, so this demo lays them out with
// a seeded synthetic 2D layout instead of the real Sentence-BERT + UMAP
// embedding. K-means++ init, Lloyd's algorithm, and the silhouette-score
// k-selection sweep (k=2..N, argmax) below are the real algorithm from the
// source, unmodified.
const ARTICLES: Record<string, string[]> = {
  Science: [
    "Quantum Mechanics", "Theory of Relativity", "Evolution", "Photosynthesis", "Plate Tectonics",
    "Genetics", "Neuroscience", "Black Holes", "Nanotechnology", "Astrobiology", "Astrophysics",
    "Climate Change", "Quantum Computing", "Evolutionary Biology", "Stem Cell Research", "Dark Matter",
    "Genetic Engineering", "Biochemistry", "Artificial Intelligence", "Biophysics", "Microbiology",
    "Botany", "Chemistry", "Ecology", "Geology", "Physics", "Mathematics", "Statistics", "Pharmacology",
    "Forensic Science",
  ],
  "Historical Events": [
    "World War II", "American Civil War", "French Revolution", "Fall of the Berlin Wall", "Moon Landing",
    "Renaissance", "Great Depression", "Industrial Revolution", "The Crusades", "Civil Rights Movement",
    "Cold War", "American Revolution", "Ancient Rome", "Byzantine Empire", "World War I",
    "Civil War in Spain", "The Enlightenment", "The Great Wall of China", "The Fall of the Roman Empire",
    "The Vietnam War", "The Spanish Inquisition", "The Ottoman Empire", "The Silk Road",
    "The Age of Exploration", "The American Frontier", "The Rise of Fascism", "The Battle of Hastings",
    "The French and Indian War", "The Gold Rush", "The Suffrage Movement",
  ],
  "Food and Drink": [
    "Pizza", "Sushi", "Tacos", "Chocolate", "Coffee", "Pasta", "Curry", "Wine", "Bread", "Ice Cream",
    "Cheesecake", "Sushi Roll", "Hamburger", "Tiramisu", "Pho", "Tapas", "Salad", "Barbecue", "Croissant",
    "Muffin", "Pancakes", "Lasagna", "Korean BBQ", "Fried Rice", "Biryani", "Pudding", "Macarons",
    "Clam Chowder", "Falafel", "Goulash", "Ceviche", "Chili",
  ],
  "Technology and Innovation": [
    "Internet of Things", "Blockchain", "Virtual Reality", "Augmented Reality", "3D Printing",
    "Cybersecurity", "Self-driving Cars", "Renewable Energy", "Biometrics", "Wearable Technology",
    "5G Technology", "Smart Homes", "Machine Learning", "Robotics", "Cloud Computing", "Drones",
    "Cryptocurrency", "Genomics", "Edge Computing", "Augmented Analytics", "Fintech", "Smart Cities",
    "Space Exploration", "Telemedicine", "Voice Assistants", "Big Data", "Digital Twins",
    "Quantum Cryptography",
  ],
  "Sports and Recreation": [
    "Soccer", "Basketball", "Tennis", "Cricket", "Baseball", "Golf", "Swimming", "Cycling", "Running",
    "Hiking", "Skiing", "Snowboarding", "Surfing", "Rock Climbing", "Yoga", "Martial Arts", "Table Tennis",
    "Badminton", "Volleyball", "Rugby", "American Football", "Ice Hockey", "Formula 1", "Motocross",
    "Gymnastics", "Wrestling", "Field Hockey", "Lacrosse", "Surf Lifesaving", "CrossFit", "Ultimate Frisbee",
  ],
};

type Point = [number, number];

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function dist2(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function kmeansPlusPlusInit(data: Point[], k: number, rand: () => number): Point[] {
  const centers: Point[] = [data[Math.floor(rand() * data.length)]];
  while (centers.length < k) {
    const d2 = data.map((p) => Math.min(...centers.map((c) => dist2(p, c))));
    const sum = d2.reduce((a, b) => a + b, 0);
    let r = rand() * sum;
    let idx = 0;
    for (; idx < d2.length; idx++) {
      r -= d2[idx];
      if (r <= 0) break;
    }
    centers.push(data[Math.min(idx, data.length - 1)]);
  }
  return centers;
}

function kmeans(data: Point[], k: number, rand: () => number, maxIter = 100) {
  let centers = kmeansPlusPlusInit(data, k, rand);
  let labels = new Array(data.length).fill(-1);
  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    const newLabels = data.map((p) => {
      let best = 0;
      let bestD = Infinity;
      centers.forEach((c, ci) => {
        const d = dist2(p, c);
        if (d < bestD) {
          bestD = d;
          best = ci;
        }
      });
      return best;
    });
    for (let i = 0; i < data.length; i++) if (newLabels[i] !== labels[i]) changed = true;
    labels = newLabels;
    const sums = Array.from({ length: k }, () => [0, 0]);
    const counts = new Array(k).fill(0);
    data.forEach((p, i) => {
      sums[labels[i]][0] += p[0];
      sums[labels[i]][1] += p[1];
      counts[labels[i]]++;
    });
    centers = sums.map((s, ci) =>
      counts[ci] > 0 ? ([s[0] / counts[ci], s[1] / counts[ci]] as Point) : centers[ci]
    );
    if (!changed) break;
  }
  return { centers, labels };
}

function silhouetteScore(data: Point[], labels: number[], k: number): number {
  const n = data.length;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const ci = labels[i];
    let aSum = 0;
    let aCount = 0;
    const bSum = new Array(k).fill(0);
    const bCount = new Array(k).fill(0);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = Math.sqrt(dist2(data[i], data[j]));
      if (labels[j] === ci) {
        aSum += d;
        aCount++;
      } else {
        bSum[labels[j]] += d;
        bCount[labels[j]]++;
      }
    }
    const a = aCount > 0 ? aSum / aCount : 0;
    let b = Infinity;
    for (let c = 0; c < k; c++) {
      if (c === ci || bCount[c] === 0) continue;
      const avg = bSum[c] / bCount[c];
      if (avg < b) b = avg;
    }
    if (!isFinite(b)) b = 0;
    total += a === 0 && b === 0 ? 0 : (b - a) / Math.max(a, b);
  }
  return total / n;
}

const MIN_K = 2;
const MAX_K = 10;
const COLORS = [
  "#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa",
  "#f472b6", "#2dd4bf", "#fb923c", "#a3e635", "#22d3ee",
];

function computeAll() {
  const seen = new Set<string>();
  const items: { title: string; category: string }[] = [];
  for (const [category, titles] of Object.entries(ARTICLES)) {
    for (const title of titles) {
      if (seen.has(title)) continue;
      seen.add(title);
      items.push({ title, category });
    }
  }

  const categories = Object.keys(ARTICLES);
  const layoutRand = mulberry32(42);
  const R = 6;
  const centroids: Record<string, Point> = {};
  categories.forEach((cat, i) => {
    const angle = (2 * Math.PI * i) / categories.length;
    centroids[cat] = [R * Math.cos(angle), R * Math.sin(angle)];
  });
  const SIGMA = 1.6;
  const points: Point[] = items.map(({ category }) => {
    const [cx, cy] = centroids[category];
    return [cx + gaussian(layoutRand) * SIGMA, cy + gaussian(layoutRand) * SIGMA];
  });

  const sweep: { k: number; labels: number[]; score: number }[] = [];
  for (let k = MIN_K; k <= MAX_K; k++) {
    const { labels } = kmeans(points, k, mulberry32(1000 + k));
    sweep.push({ k, labels, score: silhouetteScore(points, labels, k) });
  }
  const bestK = sweep.reduce((best, s) => (s.score > best.score ? s : best)).k;

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const bounds = {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };

  return { items, points, sweep, bestK, bounds };
}

type ComputedData = ReturnType<typeof computeAll>;

export default function ClusteringDemo() {
  // The k-means/silhouette sweep involves iterative floating-point
  // comparisons that can diverge by a bit between the server's JS engine and
  // the browser's, so it's computed client-side only (post-mount) rather
  // than during render, to avoid a hydration mismatch.
  const [state, setState] = useState<{ data: ComputedData; k: number } | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    function init() {
      const result = computeAll();
      setState({ data: result, k: result.bestK });
    }
    init();
  }, []);

  if (!state) {
    return (
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
        <div className="py-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const { data, k } = state;
  const setK = (newK: number) => setState({ data, k: newK });

  const current = data.sweep.find((s) => s.k === k)!;
  const maxScore = Math.max(...data.sweep.map((s) => s.score));

  const W = 500, H = 320, PAD = 20;
  const { minX, maxX, minY, maxY } = data.bounds;
  const sx = (x: number) => PAD + ((x - minX) / (maxX - minX)) * (W - 2 * PAD);
  const sy = (y: number) => PAD + ((maxY - y) / (maxY - minY)) * (H - 2 * PAD);

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-4">
        The real pipeline scrapes 155 Wikipedia articles live and never saves its fitted embeddings, so
        these {data.items.length} real article titles are laid out on a seeded synthetic 2D map instead —
        but the clustering itself is the actual algorithm: k-means++ initialization, Lloyd&apos;s algorithm,
        and systematic k-selection by silhouette score, run for real in your browser.
      </p>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-[#0a0f1e] rounded-md border border-[#1e293b]">
          {data.points.map((p, i) => (
            <circle
              key={i}
              cx={sx(p[0])}
              cy={sy(p[1])}
              r={hover === i ? 5 : 3.2}
              fill={COLORS[current.labels[i] % COLORS.length]}
              opacity={hover === null || hover === i ? 0.9 : 0.35}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer transition-[opacity,r] duration-100"
            />
          ))}
        </svg>
        {hover !== null && (
          <div className="absolute top-2 left-2 text-xs bg-[#1e293b] text-[#f1f5f9] px-2 py-1 rounded border border-[#334155] pointer-events-none">
            {data.items[hover].title}
            <span className="text-[#64748b]"> — {data.items[hover].category}</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-xs text-[#94a3b8]">
            k = {k} clusters
            {k === data.bestK && (
              <span className="ml-2 text-[#fbbf24]">★ highest silhouette score</span>
            )}
          </label>
          <span className="text-xs font-mono text-[#3b82f6]">silhouette: {current.score.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={MIN_K}
          max={MAX_K}
          step={1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="w-full accent-[#3b82f6] cursor-pointer"
        />
      </div>

      <div className="mt-4 flex items-end gap-1 h-16">
        {data.sweep.map((s) => (
          <button
            key={s.k}
            onClick={() => setK(s.k)}
            className="flex-1 rounded-t transition-colors cursor-pointer"
            style={{
              height: `${Math.max(4, (s.score / maxScore) * 100)}%`,
              backgroundColor: s.k === k ? "#3b82f6" : "#1e293b",
            }}
            title={`k=${s.k}: ${s.score.toFixed(3)}`}
          />
        ))}
      </div>
      <p className="text-[10px] text-[#475569] mt-1">
        Silhouette score for every k from {MIN_K} to {MAX_K} — the real selection rule picks whichever bar
        is tallest, the same argmax sweep the pipeline runs over k=2..19.
      </p>
    </div>
  );
}
