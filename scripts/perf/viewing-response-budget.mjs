import { performance } from "node:perf_hooks";

const DEFAULT_URL = "http://localhost:3020/services/viewing";
const DEFAULT_BUDGET_MS = 50;
const DEFAULT_SAMPLES = 8;
const DEFAULT_WARMUPS = 2;

const url = process.argv[2] || process.env.VIEWING_PERF_URL || DEFAULT_URL;
const budgetMs = Number(process.env.VIEWING_PERF_BUDGET_MS || DEFAULT_BUDGET_MS);
const samples = Number(process.env.VIEWING_PERF_SAMPLES || DEFAULT_SAMPLES);
const warmups = Number(process.env.VIEWING_PERF_WARMUPS || DEFAULT_WARMUPS);

if (!Number.isFinite(budgetMs) || budgetMs <= 0) {
  throw new Error("VIEWING_PERF_BUDGET_MS must be a positive number.");
}

if (!Number.isInteger(samples) || samples <= 0) {
  throw new Error("VIEWING_PERF_SAMPLES must be a positive integer.");
}

if (!Number.isInteger(warmups) || warmups < 0) {
  throw new Error("VIEWING_PERF_WARMUPS must be a non-negative integer.");
}

const measure = async (index, isWarmup) => {
  const startedAt = performance.now();
  const response = await fetch(url, {
    headers: {
      "cache-control": "no-cache",
    },
  });

  await response.arrayBuffer();
  const elapsedMs = performance.now() - startedAt;

  return {
    index,
    phase: isWarmup ? "warmup" : "sample",
    status: response.status,
    elapsedMs: Number(elapsedMs.toFixed(1)),
  };
};

const results = [];

for (let index = 1; index <= warmups + samples; index += 1) {
  const isWarmup = index <= warmups;
  results.push(await measure(index, isWarmup));
}

const measured = results.filter((result) => result.phase === "sample");
const failures = measured.filter(
  (result) => result.status !== 200 || result.elapsedMs > budgetMs,
);
const maxMs = Math.max(...measured.map((result) => result.elapsedMs));
const avgMs =
  measured.reduce((total, result) => total + result.elapsedMs, 0) /
  measured.length;

console.table(results);
console.log(
  `Viewing response budget: max ${maxMs.toFixed(1)}ms, avg ${avgMs.toFixed(
    1,
  )}ms, budget <= ${budgetMs}ms`,
);

if (failures.length > 0) {
  console.error(
    `Viewing response budget failed for ${failures.length} sample(s).`,
  );
  process.exit(1);
}
