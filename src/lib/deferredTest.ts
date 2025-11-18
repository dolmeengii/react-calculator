import { calculate } from '@lib/calculate';
import { markEnd, markStart, measure } from '@lib/measure';
import { buildInput } from '@lib/baseline';

type DeferredResult = {
  size: number;
  runs: number;
  avgDuration: number;
};

const SIZES = [10, 100, 300, 1000];

export async function runDeferredTest(runsPerSize = 20): Promise<DeferredResult[]> {
  const results: DeferredResult[] = [];

  for (const size of SIZES) {
    const input = buildInput(size);
    const durations: number[] = [];

    for (let i = 0; i < runsPerSize; i++) {
      const duration = await new Promise<number>((resolve) => {
        requestIdleCallback(() => {
          markStart('deferred');
          calculate(input);
          markEnd('deferred');
          const time = measure('deferred');
          resolve(time);
        });
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