import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, CloudRain, X } from "lucide-react";
import { SUNNY_ITINERARY } from "../data/guest";
import { useApp } from "../context/AppContext";

export default function DemoControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const { weather, setDemoWeather, setItinerary, liveTemp, simulateDisruption } = useApp();
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(true);
  const appMode = location.pathname.startsWith("/admin") ? "admin" : "guest";

  return (
    <>
      {!isDemoControlsOpen && (
        <button
          onClick={() => setIsDemoControlsOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-brand-900 text-white px-3 py-2 text-xs font-medium shadow-lg md:hidden"
        >
          Controls
        </button>
      )}

      <div
        className={`fixed bottom-4 right-4 z-50 flex flex-col gap-3 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-line transition-all duration-300 md:bottom-6 md:right-6 ${
          isDemoControlsOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-[130%] opacity-0 pointer-events-none md:translate-x-0 md:opacity-100 md:pointer-events-auto"
        }`}
      >
        <button
          type="button"
          aria-label="Close demo controls"
          onClick={() => setIsDemoControlsOpen(false)}
          className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-card text-ink shadow-card md:hidden"
        >
          <X size={14} />
        </button>

        <p className="text-xs font-semibold tracking-wider text-muted uppercase mb-1">
          Demo Controls
        </p>
        {typeof liveTemp === "number" && (
          <p className="text-[10px] text-muted mb-1">
            Live weather: Dehradun · {liveTemp}°C
          </p>
        )}

        <div className="flex bg-brand-50 rounded-lg p-1">
          <button
            onClick={() => navigate("/")}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === "guest" ? "bg-card shadow-card text-ink" : "text-muted hover:text-ink"}`}
          >
            Guest App
          </button>
          <button
            onClick={() => navigate("/admin")}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === "admin" ? "bg-card shadow-card text-ink" : "text-muted hover:text-ink"}`}
          >
            Admin
          </button>
        </div>

        <button
          onClick={() => {
            if (weather === "sunny") setDemoWeather("rainy");
            else {
              setDemoWeather("sunny");
              setItinerary(SUNNY_ITINERARY);
            }
          }}
          className={`flex items-center justify-center gap-2 w-full min-h-[44px] rounded-lg text-sm font-medium transition-all ${
            weather === "sunny"
              ? "bg-primary-btn text-white shadow-glow hover:brightness-110"
              : "bg-brand-500 text-white hover:bg-brand-600"
          }`}
        >
          {weather === "sunny" ? <CloudRain size={16} /> : <Sun size={16} />}
          {weather === "sunny" ? "Trigger Rain (4:00 PM)" : "Reset Weather"}
        </button>
        <button
          onClick={() => simulateDisruption("landslide")}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium bg-coral-600 text-white hover:bg-coral-500 transition-all"
        >
          Simulate landslide on Mussoorie road
        </button>
        <button
          onClick={() => simulateDisruption("roadblock")}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium bg-card border border-line text-ink hover:bg-brand-50 transition-all"
        >
          Simulate Roadblock
        </button>
      </div>
    </>
  );
}
