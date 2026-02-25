import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};