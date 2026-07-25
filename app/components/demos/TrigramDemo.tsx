"use client";

import { useMemo, useState } from "react";

// A small demo corpus trained live in the browser — real trigram models need
// far more data than is practical to ship client-side, so this is explicitly
// a toy-scale version of the same algorithm (fixed 1/3 linear interpolation
// across unigram/bigram/trigram, as in the actual repo), not a recreation of
// the original Brown Corpus-trained model.
const CORPUS = `the graduate student walked into the laboratory every morning to check on the model.
the model was training on a large dataset of images collected from the internet.
training a neural network requires patience and careful tuning of the learning rate.
the researcher adjusted the learning rate and restarted the training run.
the training run finished after several hours and the results were promising.
the results showed that the model had learned useful representations of the data.
useful representations help the model generalize to new examples it has never seen.
new examples are important for testing whether the model actually learned something.
something about the way neural networks learn remains mysterious to researchers.
researchers at columbia university study machine learning and its applications.
applications of machine learning include speech recognition and computer vision.
computer vision systems can recognize objects in images with high accuracy.
high accuracy is not the only goal since models must also be efficient.
efficient models run faster and use less memory during inference.
inference speed matters a lot in production systems that serve many users.
many users depend on fast and reliable machine learning systems every day.
every day the researcher also trained for fencing after finishing work in the lab.
fencing requires quick reflexes and careful strategic thinking during a match.
a match can be won or lost in a single decisive touch.
a touch in fencing happens faster than most spectators can perceive.
perceiving small patterns quickly is a skill shared by fencers and researchers alike.
researchers alike must notice subtle patterns hidden within noisy experimental data.
experimental data often contains noise that can mislead an untrained model.
an untrained model tends to memorize noise instead of learning general patterns.
general patterns are what separate a good model from an overfit one.
an overfit one performs well on training data but poorly on new data.
new data is the real test of whether a model has truly learned.
truly learned representations transfer well to tasks the model was never trained on.`;

const START = "<start>";
const STOP = "<stop>";

function sentences(text: string): string[][] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s
        .toLowerCase()
        .replace(/[.]/g, "")
        .split(/\s+/)
        .filter(Boolean)
    );
}

function buildModel(text: string) {
  const unigrams = new Map<string, number>();
  const bigrams = new Map<string, number>();
  const trigrams = new Map<string, number>();
  let totalTokens = 0;

  for (const sent of sentences(text)) {
    const padded = [START, START, ...sent, STOP];
    for (let i = 0; i < padded.length; i++) {
      const w = padded[i];
      unigrams.set(w, (unigrams.get(w) ?? 0) + 1);
      totalTokens++;
      if (i >= 1) {
        const bg = `${padded[i - 1]}|${w}`;
        bigrams.set(bg, (bigrams.get(bg) ?? 0) + 1);
      }
      if (i >= 2) {
        const tg = `${padded[i - 2]}|${padded[i - 1]}|${w}`;
        trigrams.set(tg, (trigrams.get(tg) ?? 0) + 1);
      }
    }
  }

  const vocab = Array.from(unigrams.keys()).filter((w) => w !== START);

  function unigramProb(w: string) {
    return (unigrams.get(w) ?? 0) / totalTokens;
  }
  function bigramProb(w1: string, w2: string) {
    const denom = unigrams.get(w1) ?? 0;
    if (denom === 0) return 1 / totalTokens;
    return (bigrams.get(`${w1}|${w2}`) ?? 0) / denom;
  }
  function trigramProb(w1: string, w2: string, w3: string) {
    const denom = bigrams.get(`${w1}|${w2}`) ?? 0;
    if (denom === 0) return 1 / totalTokens;
    return (trigrams.get(`${w1}|${w2}|${w3}`) ?? 0) / denom;
  }
  // Fixed 1/3 linear interpolation — same smoothing scheme as the real repo.
  function interpolated(w1: string, w2: string, w3: string) {
    return (
      (1 / 3) * trigramProb(w1, w2, w3) +
      (1 / 3) * bigramProb(w2, w3) +
      (1 / 3) * unigramProb(w3)
    );
  }

  function sampleNext(w1: string, w2: string): string {
    const candidates = vocab;
    const weights = candidates.map((w) => interpolated(w1, w2, w));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < candidates.length; i++) {
      r -= weights[i];
      if (r <= 0) return candidates[i];
    }
    return STOP;
  }

  function generate(seed: string[], maxLen = 22): string[] {
    const out = [...seed];
    let w1 = out.length >= 2 ? out[out.length - 2] : START;
    let w2 = out.length >= 1 ? out[out.length - 1] : START;
    for (let i = 0; i < maxLen; i++) {
      const next = sampleNext(w1, w2);
      if (next === STOP) break;
      out.push(next);
      w1 = w2;
      w2 = next;
    }
    return out;
  }

  return { generate, vocab };
}

export default function TrigramDemo() {
  const model = useMemo(() => buildModel(CORPUS), []);
  const [seed, setSeed] = useState("the model");
  const [output, setOutput] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const run = () => {
    const seedTokens = seed
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => model.vocab.includes(w));
    const generated = model.generate(seedTokens.slice(-2));
    setOutput("");
    setGenerating(true);
    let i = 0;
    const words = generated;
    const reveal = () => {
      if (i >= words.length) {
        setGenerating(false);
        return;
      }
      setOutput((prev) => (prev ? prev + " " + words[i] : words[i]));
      i++;
      setTimeout(reveal, 90);
    };
    reveal();
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-4">
        A live trigram model trained right now, in your browser, on a small demo corpus — using
        the same fixed 1/3 linear-interpolation smoothing as the real project (real language
        models need far more text than is practical to ship to a browser, so expect it to be
        charmingly repetitive rather than eloquent).
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !generating && run()}
          placeholder="Seed words (e.g. 'the model')…"
          className="flex-1 bg-[#0a0f1e] border border-[#1e293b] rounded-md px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#475569] focus:outline-none focus:border-[#3b82f6]"
        />
        <button
          onClick={run}
          disabled={generating}
          className="px-4 py-2 bg-[#3b82f6] text-white rounded-md text-sm font-medium hover:bg-[#2563eb] disabled:opacity-50 transition-colors cursor-pointer"
        >
          {generating ? "Generating…" : "Generate"}
        </button>
      </div>

      {output && (
        <div className="border-t border-[#1e293b] pt-4">
          <p className="text-[#f1f5f9] leading-relaxed">
            {output}
            {generating && (
              <span className="inline-block w-0.5 h-4 bg-[#3b82f6] ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}
