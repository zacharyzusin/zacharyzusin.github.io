"use client";

import { useState } from "react";

// An honest interactive visualizer of the arc-standard transition system
// (shift / left-arc / right-arc) the real parser is built on. This steps
// through a pre-computed oracle sequence — derived the same way the repo's
// training-data extractor derives one from a gold tree — rather than
// pretending to run the actual trained neural network, whose weights this
// demo doesn't have.
interface Sentence {
  words: string[];
  // Oracle action sequence: each entry is the action taken at that step.
  actions: { type: "SHIFT" | "LEFT-ARC" | "RIGHT-ARC"; label?: string }[];
}

const SENTENCE: Sentence = {
  words: ["the", "dog", "chased", "the", "cat"],
  actions: [
    { type: "SHIFT" }, // stack: [the]
    { type: "SHIFT" }, // stack: [the, dog]
    { type: "LEFT-ARC", label: "det" }, // dog -> the
    { type: "SHIFT" }, // stack: [dog, chased]
    { type: "SHIFT" }, // stack: [dog, chased, the]
    { type: "SHIFT" }, // stack: [dog, chased, the, cat]
    { type: "LEFT-ARC", label: "det" }, // cat -> the
    { type: "RIGHT-ARC", label: "obj" }, // chased -> cat
    { type: "LEFT-ARC", label: "nsubj" }, // chased -> dog
    { type: "RIGHT-ARC", label: "root" }, // ROOT -> chased
  ],
};

interface Arc {
  head: number;
  dependent: number;
  label: string;
}

function simulate(step: number) {
  const stack: number[] = [-1]; // -1 = ROOT
  const buffer: number[] = SENTENCE.words.map((_, i) => i);
  const arcs: Arc[] = [];

  for (let i = 0; i < step; i++) {
    const action = SENTENCE.actions[i];
    if (action.type === "SHIFT") {
      stack.push(buffer.shift()!);
    } else if (action.type === "LEFT-ARC") {
      const dependent = stack[stack.length - 2];
      const head = stack[stack.length - 1];
      arcs.push({ head, dependent, label: action.label! });
      stack.splice(stack.length - 2, 1);
    } else {
      const dependent = stack[stack.length - 1];
      const head = stack[stack.length - 2];
      arcs.push({ head, dependent, label: action.label! });
      stack.pop();
    }
  }

  return { stack, buffer, arcs };
}

function wordLabel(i: number) {
  return i === -1 ? "ROOT" : SENTENCE.words[i];
}

export default function ParserDemo() {
  const [step, setStep] = useState(0);
  const state = simulate(step);
  const maxStep = SENTENCE.actions.length;
  const nextAction = step < maxStep ? SENTENCE.actions[step] : null;

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-5">
        The real parser is a neural network — this walks through the same arc-standard transition
        system (shift / left-arc / right-arc) it&apos;s trained to imitate, step by step, on an
        oracle-derived action sequence for one sentence.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {SENTENCE.words.map((w, i) => (
          <span
            key={i}
            className={`text-sm px-3 py-1.5 rounded border ${
              state.buffer.includes(i)
                ? "border-[#1e293b] text-[#475569]"
                : "border-[#3b82f6]/40 text-[#f1f5f9] bg-[#1e293b]"
            }`}
          >
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-xs text-[#475569] mb-2 uppercase tracking-wide">Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {state.stack.map((w, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-1 bg-[#1e293b] text-[#93c5fd] rounded"
              >
                {wordLabel(w)}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-[#475569] mb-2 uppercase tracking-wide">Buffer</p>
          <div className="flex flex-wrap gap-1.5">
            {state.buffer.map((w, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-1 bg-[#0a0f1e] border border-[#1e293b] text-[#94a3b8] rounded"
              >
                {wordLabel(w)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {state.arcs.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-[#475569] mb-2 uppercase tracking-wide">Arcs so far</p>
          <div className="flex flex-col gap-1">
            {state.arcs.map((a, i) => (
              <span key={i} className="text-xs font-mono text-[#3b82f6]">
                {wordLabel(a.head)} → {wordLabel(a.dependent)}{" "}
                <span className="text-[#475569]">({a.label})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#1e293b] pt-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-xs px-3 py-1.5 border border-[#1e293b] text-[#94a3b8] rounded hover:text-[#f1f5f9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <span className="text-xs text-[#475569]">
          {step < maxStep
            ? `Next: ${nextAction!.type}`
            : "Parse complete"}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(maxStep, s + 1))}
          disabled={step === maxStep}
          className="text-xs px-3 py-1.5 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Step →
        </button>
      </div>
    </div>
  );
}
