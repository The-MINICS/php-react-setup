import { useAuth } from '@/context/useAuth';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
