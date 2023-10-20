import './App.css';
import { Grid } from './components/grid/grid';
import { generateTestData } from './model/Helper';
import { Model } from './model/Model';

function App() {
  const model = new Model();
  generateTestData(model);

  return (
    <div className="App">
      < Grid model={model} />
    </div>
  );
}

export default App;
