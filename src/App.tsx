import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import Index from './pages/Index';
import Auth from './pages/Auth';
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

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
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
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
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
          <Route
            path="/coaching/dashboard"
            element={
              <ProtectedRoute>
                <CoachingDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;