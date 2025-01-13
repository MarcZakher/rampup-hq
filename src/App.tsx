import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './integrations/supabase/client';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import DirectorDashboard from './pages/director/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import AnalyticsPage from './pages/director/Analytics';
import SalesRepDashboard from './pages/sales-rep/Dashboard';
import TrainingJourney from './pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from './pages/sales-rep/Analytics';
import CoachingDashboard from './pages/coaching/Dashboard';
import MeetingDefinitions from './pages/admin/MeetingDefinitions';
import { useToast } from './hooks/use-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive"
          });
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
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
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/meeting-definitions"
          element={
            <ProtectedRoute>
              <MeetingDefinitions />
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
  );
}

export default App;