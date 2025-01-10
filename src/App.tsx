import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;