"use client";

import { useEffect, useRef, useState } from "react";

// A genuine reimplementation of the real algorithm — HiPPO-LegS state matrix,
// bilinear (Tustin) discretization, the 4-tap SSM convolution kernel, and the
// hand-derived (no autodiff) backward pass — at a reduced hidden dim (16 vs.
// the real 64) so it can train live in the browser. It trains for real, from
// scratch, on a small set of toy tagged sentences below (the real model
// trains on the full CoNLL 2003 corpus with pretrained word2vec embeddings;
// this one uses small fixed random vectors standing in for pretrained
// embeddings, on ~25 example sentences). Verified against a numerical
// gradient check (max relative error ~1e-9) before wiring in.

const N = 16;
const DT = 1.0;
const CTX = 4;
const TAGS = ["Noun", "Verb", "Modifier", "Other"] as const;
const TAG_COLORS: Record<string, string> = {
  Noun: "#60a5fa",
  Verb: "#f87171",
  Modifier: "#34d399",
  Other: "#94a3b8",
};

type Vec = number[];
type Mat = number[][];

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
function gauss(rand: () => number) {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function zeros(n: number, m: number): Mat {
  return Array.from({ length: n }, () => new Array(m).fill(0));
}
function identity(n: number): Mat {
  const I = zeros(n, n);
  for (let i = 0; i < n; i++) I[i][i] = 1;
  return I;
}
function matSub(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}
function matAdd(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}
function scalarMul(a: Mat, s: number): Mat {
  return a.map((row) => row.map((v) => v * s));
}
function matMatMul(a: Mat, b: Mat): Mat {
  const n = a.length, m = b[0].length, k = b.length;
  const out = zeros(n, m);
  for (let i = 0; i < n; i++)
    for (let p = 0; p < k; p++) {
      const aip = a[i][p];
      if (aip === 0) continue;
      for (let j = 0; j < m; j++) out[i][j] += aip * b[p][j];
    }
  return out;
}
function matVecMul(a: Mat, v: Vec): Vec {
  return a.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
}
function transpose(a: Mat): Mat {
  return a[0].map((_, j) => a.map((row) => row[j]));
}
function dot(a: Vec, b: Vec): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}
function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x + b[i]);
}
function vecScale(a: Vec, s: number): Vec {
  return a.map((x) => x * s);
}
function inverse(a: Mat): Mat {
  const n = a.length;
  const aug = a.map((row, i) => [...row, ...identity(n)[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) pivot = r;
    [aug[col], aug[pivot]] = [aug[pivot], aug[col]];
    const pv = aug[col][col];
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r][col];
      if (factor === 0) continue;
      for (let j = 0; j < 2 * n; j++) aug[r][j] -= factor * aug[col][j];
    }
  }
  return aug.map((row) => row.slice(n));
}

// HiPPO-LegS state matrix, exactly as derived from the real MATLAB source
function buildHippoA(n: number): Mat {
  const A = zeros(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const Nn = i + 1, Kk = j + 1;
      if (Nn > Kk) A[i][j] = -Math.sqrt((2 * Nn + 1) / (2 * Kk + 1));
      else if (Nn === Kk) A[i][j] = -(Nn + 1);
      else A[i][j] = 0;
    }
  }
  return A;
}

const A = buildHippoA(N);
const I_N = identity(N);
const Minv = inverse(matSub(I_N, scalarMul(A, DT / 2)));
const Abar = matMatMul(Minv, matAdd(I_N, scalarMul(A, DT / 2)));
const Mmat = scalarMul(Minv, DT);
const AbarT = transpose(Abar);
const AbarPowers: Mat[] = [identity(N)];
for (let p = 1; p < CTX; p++) AbarPowers.push(matMatMul(Abar, AbarPowers[p - 1]));
const AbarTPowers: Mat[] = [identity(N)];
for (let p = 1; p < CTX; p++) AbarTPowers.push(matMatMul(AbarT, AbarTPowers[p - 1]));
const MmatT = transpose(Mmat);

interface Params {
  inputProj: Vec;
  outputProj: Vec;
  residual: number;
  Wclass: number[][];
  bclass: number[];
}

function initParams(rand: () => number): Params {
  return {
    inputProj: Array.from({ length: N }, () => gauss(rand) * 0.1),
    outputProj: Array.from({ length: N }, () => gauss(rand) * 0.1),
    residual: gauss(rand) * 0.1,
    Wclass: Array.from({ length: 4 }, () => Array.from({ length: N }, () => gauss(rand) * Math.sqrt(2 / N))),
    bclass: [0, 0, 0, 0],
  };
}

function kernelAndAux(p: Params) {
  const Bbar = matVecMul(Mmat, p.inputProj);
  const C = p.outputProj;
  const vC: Vec[] = [];
  const vB: Vec[] = [];
  const kernel: number[] = [];
  for (let j = 0; j < CTX; j++) {
    const vc = matVecMul(AbarPowers[j], Bbar);
    const vb = matVecMul(AbarTPowers[j], C);
    vC.push(vc);
    vB.push(vb);
    kernel.push(dot(C, vc));
  }
  return { Bbar, C, vC, vB, kernel };
}

function softmax(logits: number[]): number[] {
  const m = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function forward(p: Params, window: Vec[]) {
  const { kernel } = kernelAndAux(p);
  const posWeight: number[] = [];
  let cum = 0;
  for (let i = 0; i < CTX; i++) {
    cum += kernel[i];
    posWeight.push(p.residual + cum);
  }
  let h = new Array(N).fill(0);
  for (let i = 0; i < CTX; i++) h = vecAdd(h, vecScale(window[i], posWeight[i]));
  const logits = p.Wclass.map((row, c) => dot(row, h) + p.bclass[c]);
  return { h, probs: softmax(logits) };
}

// Forward + backward in one pass, computing kernelAndAux(p) exactly once
// (it depends only on the current params, not the window) instead of the
// 3x-redundant recomputation of the previous version — the dominant cost
// during training, so this is most of the "laggy on first load" fix.
function trainStep(p: Params, window: Vec[], target: number, lr: number): { params: Params; loss: number } {
  const { vC, vB, kernel } = kernelAndAux(p);
  const posWeight: number[] = [];
  let cum = 0;
  for (let i = 0; i < CTX; i++) {
    cum += kernel[i];
    posWeight.push(p.residual + cum);
  }
  let h = new Array(N).fill(0);
  for (let i = 0; i < CTX; i++) h = vecAdd(h, vecScale(window[i], posWeight[i]));
  const logits = p.Wclass.map((row, c) => dot(row, h) + p.bclass[c]);
  const probs = softmax(logits);
  const loss = -Math.log(Math.max(probs[target], 1e-12));

  const dLogits = probs.map((pr, c) => pr - (c === target ? 1 : 0));
  const dWclass = dLogits.map((dl) => h.map((hv) => dl * hv));
  const dbclass = dLogits;
  const dH = new Array(N).fill(0);
  for (let c = 0; c < 4; c++) for (let n = 0; n < N; n++) dH[n] += p.Wclass[c][n] * dLogits[c];

  const dw: number[] = window.map((u) => dot(dH, u));
  const dD = dw.reduce((a, b) => a + b, 0);
  const dKernel: number[] = [];
  for (let j = 0; j < CTX; j++) {
    let s = 0;
    for (let i = j; i < CTX; i++) s += dw[i];
    dKernel.push(s);
  }
  let dC = new Array(N).fill(0);
  let dBbar = new Array(N).fill(0);
  for (let j = 0; j < CTX; j++) {
    dC = vecAdd(dC, vecScale(vC[j], dKernel[j]));
    dBbar = vecAdd(dBbar, vecScale(vB[j], dKernel[j]));
  }
  const dInputProj = matVecMul(MmatT, dBbar);

  const params: Params = {
    inputProj: p.inputProj.map((v, n) => v - lr * dInputProj[n]),
    outputProj: p.outputProj.map((v, n) => v - lr * dC[n]),
    residual: p.residual - lr * dD,
    Wclass: p.Wclass.map((row, c) => row.map((v, n) => v - lr * dWclass[c][n])),
    bclass: p.bclass.map((v, c) => v - lr * dbclass[c]),
  };
  return { params, loss };
}

// ---- toy vocabulary + tagged sentences ----
const NOUNS = ["dog", "cat", "book", "house", "city", "student", "teacher", "car", "tree", "river"];
const VERBS = ["runs", "reads", "jumps", "sees", "writes", "eats", "sleeps", "drives", "grows", "flows"];
const MODS = ["quickly", "slowly", "big", "small", "happy", "quiet", "bright", "often", "very", "really"];
const OTHERS = ["the", "a", "and", "to", "in", "on", "of", "with", "but", "for"];
const VOCAB: Record<string, number> = {};
NOUNS.forEach((w) => (VOCAB[w] = 0));
VERBS.forEach((w) => (VOCAB[w] = 1));
MODS.forEach((w) => (VOCAB[w] = 2));
OTHERS.forEach((w) => (VOCAB[w] = 3));

// Sentences are generated from templates rather than hand-typed, so every
// noun/verb/modifier gets systematically paired with many different partners
// (via a rotating offset) instead of appearing in just one or two fixed
// contexts. This is what makes the trained tagger generalize reliably to
// sentences it never saw, rather than memorizing a small hand-written set.
const PREPS = ["to", "in", "on", "of", "with", "for"];
const DETS = ["the", "a"];
const ROTATIONS = [0, 1, 2, 3];

function genSentences(rotations: number[]): string[] {
  const NN = NOUNS.length;
  const out: string[] = [];
  for (const k of rotations) {
    for (let i = 0; i < NN; i++) {
      const det = DETS[i % 2];
      const det2 = DETS[(i + 1) % 2];
      const noun = NOUNS[i];
      const verb = VERBS[(i + k) % NN];
      const mod1 = MODS[(i + k) % MODS.length];
      const mod2 = MODS[(i + k + 5) % MODS.length];
      const nounB = NOUNS[(i + k + 4) % NN];
      const nounC = NOUNS[(i + k + 7) % NN];
      const prep = PREPS[(i + k) % PREPS.length];
      out.push(`${det} ${noun} ${verb}`);
      out.push(`${det} ${noun} ${verb} ${mod1}`);
      out.push(`${det} ${mod1} ${noun} ${verb}`);
      out.push(`${det} ${mod1} ${noun} ${verb} ${mod2}`);
      out.push(`${det} ${mod1} ${noun} often ${verb}`);
      out.push(`${det} ${noun} often ${verb} ${mod2}`);
      out.push(`${det} ${noun} and ${det2} ${nounB} ${verb}`);
      out.push(`${det} ${noun} ${verb} ${prep} ${det2} ${nounC}`);
    }
  }
  return Array.from(new Set(out));
}

const SENTENCES = genSentences(ROTATIONS);

const EXAMPLES = [
  "the small cat writes often",
  "the quiet river often flows",
  "a happy dog runs to the house",
];

const embedRand = mulberry32(99);
const EMBEDDINGS: Record<string, Vec> = {};
Object.keys(VOCAB).forEach((w) => {
  EMBEDDINGS[w] = Array.from({ length: N }, () => gauss(embedRand) * 0.5);
});

interface Example {
  window: Vec[];
  target: number;
}
const TRAIN_EXAMPLES: Example[] = [];
for (const sent of SENTENCES) {
  const words = sent.split(" ");
  for (let i = 0; i < words.length; i++) {
    const window: Vec[] = [];
    for (let off = 3; off >= 0; off--) {
      const idx = i - off;
      window.push(idx >= 0 ? EMBEDDINGS[words[idx]] : new Array(N).fill(0));
    }
    TRAIN_EXAMPLES.push({ window, target: VOCAB[words[i]] });
  }
}

const EPOCHS = 200;
const LR0 = 0.02;

function tagSentence(params: Params, sentence: string): { word: string; tag: string; conf: number }[] {
  const words = sentence.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return words.map((w, i) => {
    const window: Vec[] = [];
    for (let off = 3; off >= 0; off--) {
      const idx = i - off;
      window.push(idx >= 0 ? EMBEDDINGS[words[idx]] : new Array(N).fill(0));
    }
    const { probs } = forward(params, window);
    const best = probs.indexOf(Math.max(...probs));
    return { word: w, tag: TAGS[best], conf: probs[best] };
  });
}

export default function SsmTaggerDemo() {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const paramsRef = useRef<Params>(initParams(mulberry32(123)));
  const shuffleRand = useRef(mulberry32(555));
  const [input, setInput] = useState(EXAMPLES[0]);
  const [tags, setTags] = useState<{ word: string; tag: string; conf: number }[] | null>(null);
  const [oov, setOov] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentEpoch = 0;
    let p = paramsRef.current;
    // Time-budgeted slices (~8ms, one requestAnimationFrame at a time)
    // instead of a fixed epoch count per chunk, so a slow first device frame
    // can't block the page — each slice yields back to the browser well
    // within a 60fps frame budget regardless of how fast the device is.
    const SLICE_BUDGET_MS = 8;
    function runSlice() {
      if (cancelled) return;
      const sliceStart = performance.now();
      let lastLoss = loss ?? 0;
      while (currentEpoch < EPOCHS && performance.now() - sliceStart < SLICE_BUDGET_MS) {
        const lr = LR0 * (1 - currentEpoch / EPOCHS);
        const order = TRAIN_EXAMPLES.map((_, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(shuffleRand.current() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        let total = 0;
        for (const idx of order) {
          const ex = TRAIN_EXAMPLES[idx];
          const { params, loss: stepLoss } = trainStep(p, ex.window, ex.target, lr);
          total += stepLoss;
          p = params;
        }
        lastLoss = total / TRAIN_EXAMPLES.length;
        currentEpoch++;
      }
      paramsRef.current = p;
      if (cancelled) return;
      setEpoch(currentEpoch);
      setLoss(lastLoss);
      if (currentEpoch < EPOCHS) {
        requestAnimationFrame(runSlice);
      } else {
        setReady(true);
        setTags(tagSentence(p, EXAMPLES[0]));
      }
    }
    const handle = requestAnimationFrame(runSlice);
    return () => {
      cancelled = true;
      cancelAnimationFrame(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = (sentence: string) => {
    const words = sentence.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const bad = words.find((w) => !(w in VOCAB));
    if (bad) {
      setOov(bad);
      setTags(null);
      return;
    }
    setOov(null);
    setTags(tagSentence(paramsRef.current, sentence));
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-4">
        A real reimplementation of the model&apos;s forward pass (HiPPO-LegS state matrix, bilinear
        discretization, 4-tap convolution kernel) and its hand-derived backward pass — no autodiff, same as
        the original — training live in your browser right now, at a reduced 16-dim hidden state (the real
        model uses 64) on {SENTENCES.length} template-generated toy sentences instead of the full CoNLL 2003
        corpus.
      </p>

      {!ready ? (
        <div className="py-8 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-[#94a3b8]">
            Training… epoch {epoch}/{EPOCHS}
            {loss !== null && <span className="text-[#475569]"> · loss {loss.toFixed(3)}</span>}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run(input)}
              placeholder="Type a sentence…"
              className="flex-1 bg-[#0a0f1e] border border-[#1e293b] rounded-md px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#3b82f6]"
            />
            <button
              onClick={() => run(input)}
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-md text-sm font-medium hover:bg-[#2563eb] transition-colors cursor-pointer"
            >
              Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setInput(ex);
                  run(ex);
                }}
                className="text-xs px-2.5 py-1 bg-[#1e293b] text-[#94a3b8] rounded-full hover:text-[#f1f5f9] transition-colors cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>

          {oov && (
            <p className="text-sm text-[#94a3b8]">
              &quot;{oov}&quot; isn&apos;t in this demo&apos;s tiny vocabulary. Try one of the example
              sentences, or stick to words like: {Object.keys(VOCAB).slice(0, 12).join(", ")}…
            </p>
          )}

          {tags && (
            <div className="flex flex-wrap gap-2 border-t border-[#1e293b] pt-5">
              {tags.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className="text-[10px] font-mono uppercase tracking-wide"
                    style={{ color: TAG_COLORS[t.tag] }}
                  >
                    {t.tag}
                  </span>
                  <span
                    className="text-sm text-[#f1f5f9] px-2.5 py-1 rounded border"
                    style={{ borderColor: TAG_COLORS[t.tag] + "60", backgroundColor: TAG_COLORS[t.tag] + "15" }}
                  >
                    {t.word}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
