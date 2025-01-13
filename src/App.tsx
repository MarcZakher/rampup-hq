import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AnalyticsPage from './pages/director/Analytics';
import SalesRepDashboard from './pages/sales-rep/Dashboard';
import TrainingJourney from './pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from './pages/sales-rep/Analytics';
import CoachingDashboard from './pages/coaching/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/director/dashboard" element={<DirectorDashboard />} />
          <Route path="/director/analytics" element={<AnalyticsPage />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/sales-rep/dashboard" element={<SalesRepDashboard />} />
          <Route path="/sales-rep/training" element={<TrainingJourney />} />
          <Route path="/sales-rep/analytics" element={<SalesRepAnalytics />} />
          <Route path="/coaching/dashboard" element={<CoachingDashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;