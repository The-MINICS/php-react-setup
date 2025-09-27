import type { AuthContextType } from '@/interface/authContext';
import { createContext, useState, type ReactNode } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const login = (userRole: string) => {
    setIsLoggedIn(true);
    setName(name);
    setRole(userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};