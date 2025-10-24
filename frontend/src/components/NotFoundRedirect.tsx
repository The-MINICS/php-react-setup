import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";

export default function NotFoundRedirect() {
  const { role } = useAuth();

  if (!role) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin" && role !== "user") {
    // not logged in
    return <Navigate to="/protected" replace />;
  } else {
    // logged in but invalid role
    return <Navigate to={`/${role}`} replace />;
  }
}
