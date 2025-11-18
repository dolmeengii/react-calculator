import { useDeferredValue, useEffect, useState } from 'react';
import { calculate } from '@lib/calculate';
import { measureSync } from '@lib/measure';

export default function CalculatorDeferred() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!deferredInput) return;
    setPending(true);

    const { result, duration } = measureSync('deferred', () => calculate(deferredInput));

    setResult(result);
    setDuration(duration);
    setPending(false);
  }, [deferredInput]);

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="문자열 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="text-sm text-gray-500">
        입력은 즉시 반영, 계산은 낮은 우선순위로 실행합니다.
      </div>

      {pending && <div className="text-gray-400">계산 중...</div>}

      {result !== null && <div className="text-lg font-semibold">결과: {result}</div>}

      {duration !== null && (
        <div className="text-sm text-gray-600">연산 시간: {duration.toFixed(2)} ms</div>
      )}
    </div>
  );
}