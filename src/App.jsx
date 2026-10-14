import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuestApp from "./components/guest/GuestApp";
import AdminDashboard from "./components/admin/AdminDashboard";
import DemoControls from "./components/DemoControls";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

const showDemoControls =
  import.meta.env.DEV || new URLSearchParams(window.location.search).get("demo") === "1";

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen bg-surface text-ink font-sans selection:bg-saffron-500 selection:text-white transition-colors duration-300">
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestApp />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {showDemoControls && <DemoControls />}
        </BrowserRouter>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
