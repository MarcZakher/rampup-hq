import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import DirectorDashboard from '@/pages/director/Dashboard';
import ManagerDashboard from '@/pages/manager/Dashboard';
import AnalyticsPage from '@/pages/director/Analytics';
import SalesRepDashboard from '@/pages/sales-rep/Dashboard';
import TrainingJourney from '@/pages/sales-rep/TrainingJourney';
import SalesRepAnalytics from '@/pages/sales-rep/Analytics';
import CoachingDashboard from '@/pages/coaching/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

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
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['director', 'manager']}>
          <DirectorDashboard />
        </RoleProtectedRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/director/analytics',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['director', 'manager']}>
          <AnalyticsPage />
        </RoleProtectedRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['director', 'manager']}>
          <ManagerDashboard />
        </RoleProtectedRoute>
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['director']}>
          <AdminDashboard />
        </RoleProtectedRoute>
      </ProtectedRoute>
    )
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