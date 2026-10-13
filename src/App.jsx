import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuestApp from "./components/guest/GuestApp";
import AdminDashboard from "./components/admin/AdminDashboard";
import DemoControls from "./components/DemoControls";
import { AppProvider } from "./context/AppContext";

const showDemoControls =
  import.meta.env.DEV || new URLSearchParams(window.location.search).get("demo") === "1";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F7F5F2] text-[#1C1C1C] font-sans selection:bg-[#BCA37F] selection:text-white">
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
  );
}
