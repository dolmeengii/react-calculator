import { calculate } from '@lib/calculate';
import { measureSync } from '@lib/measure';

type BaselineResult = {
  size: number;
  runs: number;
  avgDuration: number;
};

export function buildInput(size: number): string {
  return Array.from({ length: size }, (_, i) => i + 1).join(',');
}

const SIZES = [10, 100, 300, 1000];

export function runBaseline(runsPerSize = 20): BaselineResult[] {
  const results: BaselineResult[] = [];

  for (const size of SIZES) {
    const input = buildInput(size);
    const durations: number[] = [];

    for (let i = 0; i < runsPerSize; i++) {
      const { duration } = measureSync('baseline', () => calculate(input));
      durations.push(duration);
    }

    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    results.push({
      size,
      runs: runsPerSize,
      avgDuration: avg,
    });
  }

  return results;
}
