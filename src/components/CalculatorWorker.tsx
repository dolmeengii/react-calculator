import { useEffect, useRef, useState } from 'react';
import type { WorkerRequest, WorkerResponse } from '../types/worker';

export default function CalculatorWorker() {
  const workerRef = useRef<Worker | null>(null);

  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/calc.worker.ts', import.meta.url), {
      type: 'module',
    });

    workerRef.current = worker;

    const handleMessage = (e: MessageEvent<WorkerResponse>) => {
      const { result, duration, error } = e.data;
      setResult(result);
      setDuration(duration);
      setError(error ?? null);
      setPending(false);
    };

    const handleError = () => {
      setPending(false);
      setResult(null);
      setError('Worker 오류가 발생했습니다');
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      worker.terminate();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);

    if (!workerRef.current) return;

    setPending(true);
    const request: WorkerRequest = { input: value };
    workerRef.current.postMessage(request);
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h2 className="font-semibold mb-2">Worker (Background Thread)</h2>

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="문자열을 입력하세요"
        value={input}
        onChange={handleChange}
      />

      <div className="mt-4 text-lg">
        {pending ? '계산 중…' : `결과: ${result ?? '0'}`}
      </div>

      {duration !== null && !pending && (
        <div className="mt-2 text-sm text-gray-600">
          계산 시간: {duration.toFixed(2)}ms
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}
