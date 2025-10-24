import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";

export default function Home() {
  const { role } = useAuth();
  return <Navigate to={role ? `/${role}` : "/protected"} replace />;
}
