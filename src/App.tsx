import Calculator from '@components/Calculator';
import BaselinePanel from '@components/BaselinePanel';
import DebouncePanel from '@components/DebouncePanel';
import DeferredPanel from '@components/DefferdPanel';
import TransitionPanel from '@components/TransitionPanel';

function App() {
  return (
    <div className="flex items-center justify-center flex-col py-8 m-10">
      <Calculator />
      <DebouncePanel />
      <DeferredPanel />
      <TransitionPanel />
      <BaselinePanel />
    </div>
  );
}

export default App;
