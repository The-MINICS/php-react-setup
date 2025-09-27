import { ThemeProvider } from './components/themeProvider'
import { AuthProvider } from './context/authContex';
import { BrowserRouter } from 'react-router';

export default function App() {
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
