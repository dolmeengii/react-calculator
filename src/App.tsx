import CalculatorWorker from '@components/CalculatorWorker';
import CalculatorBaseline from '@components/CalculatorBaseline';

function App() {
  return (
    <div className="m-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-8">
        Web Worker UX 성능 실험
      </h1>

      <p className="text-center text-gray-600 mb-8">
        동일한 입력값을 넣어 메인 스레드 vs Worker의 계산 시간을 비교해보세요.
      </p>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <CalculatorBaseline />
        <CalculatorWorker />
      </div>

      <div className="mt-12 max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">비교 포인트</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Baseline</strong>: 메인 스레드에서 동기적으로 계산 (UI 블로킹 가능)</li>
          <li>• <strong>Worker</strong>: 백그라운드 스레드에서 계산 (메인 스레드 점유 없음)</li>
          <li>• 긴 문자열 입력 시 Baseline은 입력 지연이 발생할 수 있음</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
