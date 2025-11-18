import { useState, useTransition } from 'react';
import { calculate } from '@lib/calculate';
import { measureSync } from '@lib/measure';

export default function CalculatorTransition() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    startTransition(() => {
      const { result, duration } = measureSync('transition', () => calculate(value));
      setResult(result);
      setDuration(duration);
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="문자열 입력"
        value={input}
        onChange={handleChange}
      />

      {isPending && <div className="text-gray-400">느린 작업 처리 중…</div>}

      {result !== null && <div className="text-lg font-semibold">결과: {result}</div>}

      {duration !== null && (
        <div className="text-sm text-gray-600">연산 시간: {duration.toFixed(3)} ms</div>
      )}
    </div>
  );
}