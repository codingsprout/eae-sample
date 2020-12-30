import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Headers/Header';
import Pages from './components/MainPages/Pages';
import { DataProvider } from './globalstate';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className='App'>
          <Header />
          <Pages />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
