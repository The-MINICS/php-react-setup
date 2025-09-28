import { useAuth } from '@/context/useAuth';
import Login from './components/logIn';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';

export default function AppContent() {
  const auth = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          auth.isLoggedIn ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="p-4">
              <h1 className="text-2xl font-bold">Welcome to the Protected Home Page!</h1>
              <p className="mt-2">You are successfully logged in.</p>
            </div>
          </ProtectedRoute>
        }
      />
      {/* ตัวอย่างสำหรับ role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div>Admin Only Page</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}