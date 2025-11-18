import Calculator from '@components/Calculator';
import BaselinePanel from '@components/BaselinePanel';
import DebouncePanel from '@components/DebouncePanel';

function App() {
  return (
    <div className="flex items-center justify-center flex-col py-8 m-10">
      <Calculator />
      <DebouncePanel />
      <BaselinePanel />
    </div>
  );
}

export default App;
