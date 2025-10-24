import { useAuth } from "@/context/useAuth";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import AdminHome from "./pages/admin/AdminHome";
import UserHome from "./pages/user/UserHome";
import Home from "./pages/Home";
import NotFoundRedirect from "./components/NotFoundRedirect";
import Protected from "./components/ProtectedPage";

export default function AppContent() {
  const auth = useAuth();
  const role = auth.role;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          auth.isLoggedIn ? (
            <Navigate to={role ? `/${role}` : "/protected"} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/protected"
        element={
          <ProtectedRoute>
            <Protected />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      {/* catch-all route */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}
