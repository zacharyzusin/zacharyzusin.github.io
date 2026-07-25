"use client";

import { useState } from "react";

// A small CNF (Chomsky Normal Form) probabilistic grammar — supports the
// classic PP-attachment ambiguity ("the man saw the dog with the telescope")
// to show CKY genuinely resolving structural ambiguity, not just parsing.
type Rule = { lhs: string; rhs: [string, string]; prob: number };
type LexRule = { lhs: string; word: string; prob: number };

const RULES: Rule[] = [
  { lhs: "S", rhs: ["NP", "VP"], prob: 1.0 },
  { lhs: "VP", rhs: ["V", "NP"], prob: 0.5 },
  { lhs: "VP", rhs: ["VP", "PP"], prob: 0.2 },
  { lhs: "NP", rhs: ["Det", "N"], prob: 0.7 },
  { lhs: "NP", rhs: ["NP", "PP"], prob: 0.3 },
  { lhs: "PP", rhs: ["P", "NP"], prob: 1.0 },
];

const LEX: LexRule[] = [
  { lhs: "Det", word: "the", prob: 0.6 },
  { lhs: "Det", word: "a", prob: 0.4 },
  { lhs: "N", word: "dog", prob: 0.2 },
  { lhs: "N", word: "cat", prob: 0.2 },
  { lhs: "N", word: "man", prob: 0.2 },
  { lhs: "N", word: "park", prob: 0.15 },
  { lhs: "N", word: "telescope", prob: 0.1 },
  { lhs: "N", word: "house", prob: 0.1 },
  { lhs: "V", word: "saw", prob: 0.3 },
  { lhs: "V", word: "chased", prob: 0.3 },
  { lhs: "V", word: "walked", prob: 0.2 },
  { lhs: "V", word: "ate", prob: 0.2 },
  { lhs: "P", word: "with", prob: 0.4 },
  { lhs: "P", word: "in", prob: 0.3 },
  { lhs: "P", word: "on", prob: 0.3 },
  // Intransitive verb senses — lets "walked"/"ate" head a VP on their own
  // (VP's rule probabilities above + these two still sum to 1.0)
  { lhs: "VP", word: "walked", prob: 0.15 },
  { lhs: "VP", word: "ate", prob: 0.15 },
];

const VOCAB = Array.from(new Set(LEX.map((l) => l.word))).sort();

interface Cell {
  [nonterminal: string]: {
    logProb: number;
    back: { split: number; b: string; c: string } | { word: string } | null;
  };
}

interface ParseResult {
  ok: true;
  tree: TreeNode;
  logProb: number;
  chart: Cell[][];
  n: number;
}
type ParseFail = { ok: false; reason: string };

interface TreeNode {
  label: string;
  word?: string;
  children?: TreeNode[];
}

function parse(tokens: string[]): ParseResult | ParseFail {
  const n = tokens.length;
  if (n === 0) return { ok: false, reason: "Type a sentence first." };
  for (const w of tokens) {
    if (!VOCAB.includes(w)) {
      return {
        ok: false,
        reason: `"${w}" isn't in this demo's tiny vocabulary. Try words like: ${VOCAB.join(", ")}.`,
      };
    }
  }

  // chart[i][j] = cell covering the span [i, j) — j exclusive, 1-indexed length via (j-i)
  const chart: Cell[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({}))
  );

  // Base case: length-1 spans from lexical rules
  for (let i = 0; i < n; i++) {
    const word = tokens[i];
    for (const lex of LEX) {
      if (lex.word === word) {
        const logProb = Math.log(lex.prob);
        const existing = chart[i][i + 1][lex.lhs];
        if (!existing || logProb > existing.logProb) {
          chart[i][i + 1][lex.lhs] = { logProb, back: { word } };
        }
      }
    }
  }

  // Length-increasing loop — the O(n³·|G|) CKY chart fill
  for (let span = 2; span <= n; span++) {
    for (let i = 0; i <= n - span; i++) {
      const j = i + span;
      for (let k = i + 1; k < j; k++) {
        const left = chart[i][k];
        const right = chart[k][j];
        for (const rule of RULES) {
          const [B, C] = rule.rhs;
          if (left[B] !== undefined && right[C] !== undefined) {
            const logProb =
              Math.log(rule.prob) + left[B].logProb + right[C].logProb;
            const existing = chart[i][j][rule.lhs];
            if (!existing || logProb > existing.logProb) {
              chart[i][j][rule.lhs] = {
                logProb,
                back: { split: k, b: B, c: C },
              };
            }
          }
        }
      }
    }
  }

  const top = chart[0][n]["S"];
  if (!top) {
    return {
      ok: false,
      reason: "No valid parse under this demo's grammar (try one of the example sentences).",
    };
  }

  function buildTree(i: number, j: number, label: string): TreeNode {
    const cell = chart[i][j][label];
    if (!cell || !cell.back) return { label };
    if ("word" in cell.back) {
      return { label, word: cell.back.word };
    }
    const { split, b, c } = cell.back;
    return {
      label,
      children: [buildTree(i, split, b), buildTree(split, j, c)],
    };
  }

  return {
    ok: true,
    tree: buildTree(0, n, "S"),
    logProb: top.logProb,
    chart,
    n,
  };
}

function TreeView({ node }: { node: TreeNode }) {
  if (node.word) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs font-mono text-[#3b82f6] mb-1">{node.label}</span>
        <span className="text-sm text-[#f1f5f9] bg-[#1e293b] px-2 py-1 rounded">
          {node.word}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-mono text-[#3b82f6] mb-2">{node.label}</span>
      <div className="flex gap-4 items-start border-t border-[#1e293b] pt-2">
        {node.children?.map((c, i) => <TreeView key={i} node={c} />)}
      </div>
    </div>
  );
}

const EXAMPLES = [
  "the man saw the dog with the telescope",
  "the cat chased a dog",
  "a man walked in the park",
];

export default function CkyDemo() {
  const [input, setInput] = useState(EXAMPLES[0]);
  const [result, setResult] = useState<ParseResult | ParseFail | null>(null);

  const run = (sentence: string) => {
    const tokens = sentence.trim().toLowerCase().split(/\s+/).filter(Boolean);
    setResult(parse(tokens));
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-4">
        A real client-side re-implementation of the probabilistic CKY parser above, running the
        same Viterbi chart-filling algorithm on a small demo grammar (vocabulary:{" "}
        {VOCAB.join(", ")}).
      </p>

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
          Parse
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

      {result && (
        <div className="border-t border-[#1e293b] pt-6">
          {result.ok ? (
            <>
              <div className="overflow-x-auto pb-2">
                <TreeView node={result.tree} />
              </div>
              <p className="text-xs text-[#475569] mt-4">
                Highest-probability parse found (log probability: {result.logProb.toFixed(3)}).
                {result.tree.children?.[1]?.label === "VP" &&
                  " Note how the parser resolves attachment ambiguity by picking the higher-probability structure."}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#94a3b8]">{result.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}
