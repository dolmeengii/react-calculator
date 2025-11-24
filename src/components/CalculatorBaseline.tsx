import { useState } from 'react';
import { calculate } from '@lib/calculate';

export default function CalculatorBaseline() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);

    const startTime = performance.now();

    try {
      const r = calculate(value);
      const elapsed = performance.now() - startTime;
      setResult(r);
      setDuration(elapsed);
    } catch (err) {
      const elapsed = performance.now() - startTime;
      setResult(null);
      setDuration(elapsed);
      setError(err instanceof Error ? err.message : '계산 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h2 className="font-semibold mb-2">Baseline (Main Thread)</h2>

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="문자열을 입력하세요"
        value={input}
        onChange={handleChange}
      />

      <div className="mt-4 text-lg">결과: {result !== null ? result : '0'}</div>

      {duration !== null && (
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
