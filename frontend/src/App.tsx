import { AuthProvider } from './context/authContex';
import { ThemeProvider } from './components/themeProvider';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AppContent />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
