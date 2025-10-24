import { useAuth } from '@/context/useAuth';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, role } = useAuth();
  const token = localStorage.getItem('authToken');

  if (!token) {
    // no token in localStorage
    return <Navigate to="/login" replace />;
  }

  if (!isLoggedIn) {
    // not logged in or invalid token
    return null;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    // loged in but role not allowed
    return <Navigate to={role ? `/${role}` : '/protected'} replace />;
  }

  return <>{children}</>;
}
