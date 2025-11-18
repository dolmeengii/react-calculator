import { calculate } from '@lib/calculate';
import { markEnd, markStart, measure } from '@lib/measure';
import { buildInput } from '@lib/baseline';

type TransitionResult = {
  size: number;
  runs: number;
  avgDuration: number;
};

const SIZES = [10, 100, 300, 1000];

export async function runTransitionTest(runsPerSize = 20): Promise<TransitionResult[]> {
  const results: TransitionResult[] = [];

  for (const size of SIZES) {
    const input = buildInput(size);
    const durations: number[] = [];

    for (let i = 0; i < runsPerSize; i++) {
      const duration = await new Promise<number>((resolve) => {
        setTimeout(() => {
          markStart('transition');
          calculate(input);
          markEnd('transition');
          resolve(measure('transition'));
        }, 0);
      });

      durations.push(duration);
    }

    const avg = durations.reduce((s, d) => s + d, 0) / durations.length;

    results.push({
      size,
      runs: runsPerSize,
      avgDuration: avg,
    });
  }

  return results;
}