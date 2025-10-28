import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: { role: string; name: string } = jwtDecode(token);
        setIsLoggedIn(true);
        setRole(decoded.role);
        setName(decoded.name);
      } catch {
        setIsLoggedIn(false);
        setRole(null);
        setName(null);
      }
    }
  }, []);

  const login = (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { role: string; name: string } = jwtDecode(token);
          setIsLoggedIn(true);
          setRole(decoded.role);
          setName(decoded.name);
        } catch {
          setIsLoggedIn(false);
          setRole(null);
          setName(null);
        }
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
      setName(null);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setName(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
