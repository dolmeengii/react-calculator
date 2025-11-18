import Calculator from '@components/Calculator';
import BaselinePanel from '@components/BaselinePanel';
import DebouncePanel from '@components/DebouncePanel';
import DeferredPanel from '@components/DefferdPanel';

function App() {
  return (
    <div className="flex items-center justify-center flex-col py-8 m-10">
      <Calculator />
      <DebouncePanel />
      <DeferredPanel />
      <BaselinePanel />
    </div>
  );
}

export default App;
