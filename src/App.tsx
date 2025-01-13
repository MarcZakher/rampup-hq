import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './config/routes';

/**
 * AppRoutes component that renders the application routes
 * Uses the routes configuration from config/routes.tsx
 */
function AppRoutes() {
  return useRoutes(routes);
}

/**
 * Main App component
 * Wraps the application with BrowserRouter and renders the routes
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;