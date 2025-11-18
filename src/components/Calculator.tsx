import { useState } from 'react';
import { calculate } from '@lib/calculate';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      const value = calculate(input);
      setResult(value);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
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
      {error && <div className="text-red-500 font-semibold">{error}</div>}
    </div>
  );
}