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
          className="fixed bottom-4 right-4 z-50 rounded-full bg-[#1C1C1C] text-white px-3 py-2 text-xs font-medium shadow-lg md:hidden"
        >
          Controls
        </button>
      )}

      <div
        className={`fixed bottom-4 right-4 z-50 flex flex-col gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E5E0D8] transition-all duration-300 md:bottom-6 md:right-6 ${
          isDemoControlsOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-[130%] opacity-0 pointer-events-none md:translate-x-0 md:opacity-100 md:pointer-events-auto"
        }`}
      >
        <button
          type="button"
          aria-label="Close demo controls"
          onClick={() => setIsDemoControlsOpen(false)}
          className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1C1C1C] shadow-sm md:hidden"
        >
          <X size={14} />
        </button>

        <p className="text-xs font-semibold tracking-wider text-[#8C857B] uppercase mb-1">
          Demo Controls
        </p>
        {typeof liveTemp === "number" && (
          <p className="text-[10px] text-[#8C857B] mb-1">
            Live weather: Dehradun · {liveTemp}°C
          </p>
        )}

        <div className="flex bg-[#F0ECE4] rounded-lg p-1">
          <button
            onClick={() => navigate("/")}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === "guest" ? "bg-white shadow-sm text-[#1C1C1C]" : "text-[#8C857B] hover:text-[#1C1C1C]"}`}
          >
            Guest App
          </button>
          <button
            onClick={() => navigate("/admin")}
            className={`flex-1 text-sm px-4 py-2 rounded-md font-medium transition-all ${appMode === "admin" ? "bg-white shadow-sm text-[#1C1C1C]" : "text-[#8C857B] hover:text-[#1C1C1C]"}`}
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
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
            weather === "sunny"
              ? "bg-[#1C1C1C] text-white hover:bg-[#2A2A2A]"
              : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
          }`}
        >
          {weather === "sunny" ? <CloudRain size={16} /> : <Sun size={16} />}
          {weather === "sunny" ? "Trigger Rain (4:00 PM)" : "Reset Weather"}
        </button>
        <button
          onClick={() => simulateDisruption("landslide")}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium bg-[#7C2D12] text-white hover:bg-[#9A3412] transition-all"
        >
          Simulate landslide on Mussoorie road
        </button>
        <button
          onClick={() => simulateDisruption("roadblock")}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium bg-white border border-[#E5E0D8] text-[#1C1C1C] hover:bg-[#F0ECE4] transition-all"
        >
          Simulate Roadblock
        </button>
      </div>
    </>
  );
}
