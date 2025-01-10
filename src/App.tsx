import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/context/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AnalyticsPage from './pages/director/Analytics';
import SalesRepDashboard from './pages/sales-rep/Dashboard';
import TrainingJourney from './pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from './pages/sales-rep/Analytics';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/director/dashboard"
            element={
              <ProtectedRoute>
                <DirectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-rep/dashboard"
            element={
              <ProtectedRoute>
                <SalesRepDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-rep/training"
            element={
              <ProtectedRoute>
                <TrainingJourney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-rep/analytics"
            element={
              <ProtectedRoute>
                <SalesRepAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;