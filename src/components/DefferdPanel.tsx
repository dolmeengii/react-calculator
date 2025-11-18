import { useState } from 'react';
import { runDeferredTest } from '@lib/deferredTest';

type DeferredResult = {
  size: number;
  runs: number;
  avgDuration: number;
};

export default function DeferredPanel() {
  const [rows, setRows] = useState<DeferredResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    const result = await runDeferredTest(20);
    setRows(result);
    setLoading(false);
  };

  return (
    <div className="mt-8 border rounded-lg p-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="font-semibold text-lg">Deferred 성능 측정</h2>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? '측정 중...' : 'Deferred 측정 실행'}
        </button>
      </div>

      {!rows && <p className="text-sm text-gray-500">버튼을 눌러 측정을 시작하세요.</p>}

      {rows && (
        <table className="w-full text-sm border-t border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">입력 길이</th>
              <th className="py-2 text-right">실행 횟수</th>
              <th className="py-2 text-right">평균 연산 시간(ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size} className="border-b last:border-0">
                <td className="py-1">{row.size}</td>
                <td className="py-1 text-right">{row.runs}</td>
                <td className="py-1 text-right">{row.avgDuration.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
