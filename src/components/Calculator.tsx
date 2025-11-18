import { useState } from 'react';
import { calculate } from '@lib/calculate';
import { markEnd, markStart, measure } from '@lib/measure';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      markStart('calc');
      const value = calculate(input);
      markEnd('calc');
      const time = measure('calc');

      setResult(value);
      setDuration(time);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
      setDuration(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="문자열을 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="bg-blue-500 text-white py-2 rounded" onClick={handleCalculate}>
        계산하기
      </button>

      {result !== null && <div className="text-lg font-semibold">결과: {result}</div>}
      {duration !== null && (
        <div className="text-sm text-gray-600">연산 시간: {duration.toFixed(2)} ms</div>
      )}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
    </div>
  );
}
