import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DirectorDashboard from './pages/director/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;