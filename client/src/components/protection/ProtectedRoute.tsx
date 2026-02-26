import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    if (!isLoadingAuth && user && allowedRole && user.role !== allowedRole) {
      toast.error("Vous n'êtes pas autorisé(e) à accéder à cette espace.");
    }
  }, [user, allowedRole, isLoadingAuth]);

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