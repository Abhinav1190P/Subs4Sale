import Layout from './Layout';
import { BrowserRouter as Router } from 'react-router-dom'
import Routez from './Routez';

function App() {
  return (
    <div>
      <Layout>
        <Router>
          <Routez />
        </Router>
      </Layout>
    </div>
  );
}

export default App;
