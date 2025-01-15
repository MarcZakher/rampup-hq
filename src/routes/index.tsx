import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import DirectorDashboard from '@/pages/director/Dashboard';
import ManagerDashboard from '@/pages/manager/Dashboard';
import AssessmentsPage from '@/pages/manager/Assessments';
import AnalyticsPage from '@/pages/director/Analytics';
import SalesRepDashboard from '@/pages/sales-rep/Dashboard';
import TrainingJourney from '@/pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from '@/pages/sales-rep/Analytics';
import CoachingDashboard from '@/pages/coaching/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/auth',
    element: <Auth />
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
    path: '/manager/assessments',
    element: <ProtectedRoute><AssessmentsPage /></ProtectedRoute>
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
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