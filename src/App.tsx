import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AnalyticsPage from './pages/director/Analytics';
import SalesRepDashboard from './pages/sales-rep/Dashboard';
import TrainingJourney from './pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from './pages/sales-rep/Analytics';
import CoachingDashboard from './pages/coaching/Dashboard';
import MeetingDefinitions from './pages/admin/MeetingDefinitions';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/director/dashboard" element={<DirectorDashboard />} />
        <Route path="/director/analytics" element={<AnalyticsPage />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/meeting-definitions" element={<MeetingDefinitions />} />
        <Route path="/sales-rep/dashboard" element={<SalesRepDashboard />} />
        <Route path="/sales-rep/training" element={<TrainingJourney />} />
        <Route path="/sales-rep/analytics" element={<SalesRepAnalytics />} />
        <Route path="/coaching/dashboard" element={<CoachingDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;