import { calculate } from '@lib/calculate';
import { markEnd, markStart, measure } from '@lib/measure';
import { debounce } from '@utils/debounce';
import { buildInput } from '@lib/baseline';

type DebounceResult = {
  size: number;
  runs: number;
  avgDuration: number;
};

const SIZES = [10, 100, 300, 1000];

export async function runDebounceTest(runsPerSize = 20): Promise<DebounceResult[]> {
  const results: DebounceResult[] = [];

  const delay = 300;

  for (const size of SIZES) {
    const input = buildInput(size);
    const durations: number[] = [];

    for (let i = 0; i < runsPerSize; i++) {
      const time = await new Promise<number>((resolve) => {
        const debouncedCalc = debounce(() => {
          markStart('debounce');
          calculate(input);
          markEnd('debounce');
          const duration = measure('debounce');
          resolve(duration);
        }, delay);

        debouncedCalc();
      });

      durations.push(time);
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