import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AnalyticsPage from './pages/director/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
        <Route path="/director/analytics" element={<AnalyticsPage />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/sales-rep/dashboard" element={<div>Sales Rep Dashboard</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;