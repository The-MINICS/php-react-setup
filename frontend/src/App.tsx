import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";
import { AuthProvider } from "./context/AuthContex";
import { ThemeProvider } from "./components/ThemeProvider";

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
