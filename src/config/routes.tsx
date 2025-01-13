import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import DirectorDashboard from '@/pages/director/Dashboard';
import ManagerDashboard from '@/pages/manager/Dashboard';
import AnalyticsPage from '@/pages/director/Analytics';
import SalesRepDashboard from '@/pages/sales-rep/Dashboard';
import TrainingJourney from '@/pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from '@/pages/sales-rep/Analytics';
import CoachingDashboard from '@/pages/coaching/Dashboard';
import MeetingDefinitions from '@/pages/admin/MeetingDefinitions';
import AdminDashboard from '@/pages/admin/Dashboard';

/**
 * Application route configuration
 * Each route object defines the path and corresponding component to render
 */
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/director/dashboard',
    element: <ProtectedRoute><DirectorDashboard /></ProtectedRoute>
  },
  {
    path: '/director/analytics',
    element: <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
  },
  {
    path: '/manager/dashboard',
    element: <ProtectedRoute><ManagerDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  },
  {
    path: '/admin/meeting-definitions',
    element: <ProtectedRoute><MeetingDefinitions /></ProtectedRoute>
  },
  {
    path: '/sales-rep/dashboard',
    element: <ProtectedRoute><SalesRepDashboard /></ProtectedRoute>
  },
  {
    path: '/sales-rep/training',
    element: <ProtectedRoute><TrainingJourney /></ProtectedRoute>
  },
  {
    path: '/sales-rep/analytics',
    element: <ProtectedRoute><SalesRepAnalytics /></ProtectedRoute>
  },
  {
    path: '/coaching/dashboard',
    element: <ProtectedRoute><CoachingDashboard /></ProtectedRoute>
  }
];