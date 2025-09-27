
export interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  name: string | null;
  login: (userRole: string) => void;
  logout: () => void;
}