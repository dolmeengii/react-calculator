import { useEffect, useState } from 'react';
import { calculate } from '@lib/calculate';
import { measureSync } from '@lib/measure';
import { useDebounce } from '@utils/useDebounce';

export default function CalculatorDebounce() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    if (!debouncedInput) return;

    try {
      const { result, duration } = measureSync('debounce', () => calculate(debouncedInput));
      setResult(result);
      setDuration(duration);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
      setDuration(null);
    }
  }, [debouncedInput]);

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="문자열 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="text-sm text-gray-500">디바운스 타이머(300ms) 이후 계산합니다.</div>

      {result !== null && <div className="text-lg font-semibold">결과: {result}</div>}

      {duration !== null && (
        <div className="text-sm text-gray-600">연산 시간: {duration.toFixed(2)} ms</div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}