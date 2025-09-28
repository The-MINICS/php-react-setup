import { ThemeProvider } from './components/themeProvider'
import { AuthProvider } from './context/authContex';
import { BrowserRouter } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import Login from './components/logIn';

export default function App() {
  const auth = useContext(AuthContext);

  if (!auth?.isLoggedIn) {
    return <Login />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="flex items-center justify-center min-h-screen">
            Hello World
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
