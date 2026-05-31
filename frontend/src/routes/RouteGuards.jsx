import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};
