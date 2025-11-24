import { calculate } from '../lib/calculate';
import type { WorkerRequest, WorkerResponse } from '../types/worker';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { input } = event.data;
  const startTime = performance.now();

  try {
    const result = calculate(input);
    const duration = performance.now() - startTime;

    const response: WorkerResponse = { result, duration };
    self.postMessage(response);
  } catch (e: unknown) {
    const duration = performance.now() - startTime;
    const errorMessage = e instanceof Error ? e.message : '계산 중 오류가 발생했습니다';

    const response: WorkerResponse = { result: null, duration, error: errorMessage };
    self.postMessage(response);
  }
};
