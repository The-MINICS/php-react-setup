export interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  name: string | null;
  login: (isLoggedIn: boolean) => void;
  logout: () => void;
}