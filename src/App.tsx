import Calculator from '@components/Calculator';
import BaselinePanel from '@components/BaselinePanel';

function App() {
  return (
    <div className="flex items-center justify-center flex-col py-8 m-10">
      <Calculator />
      <BaselinePanel />
    </div>
  );
}

export default App;
