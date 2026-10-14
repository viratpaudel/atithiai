import {
  Sparkles,
  CloudRain,
  Check,
  LayoutDashboard,
  User,
  Bell,
  CalendarDays,
  Thermometer,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import StatCard from "./StatCard";
import { useApp } from "../../context/AppContext";
import ThemeToggle from "../ui/ThemeToggle";

export default function AdminDashboard() {
  const { weather, itinerary, requests, guardianLog, impact, rankedAlternatives, disruptions } = useApp();
  const isConflict =
    weather === "rainy" && itinerary.some((i) => i.isVulnerableToWeather);
  const isResolved = weather === "rainy" && itinerary.some((i) => i.aiAdjusted);

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <div className="w-64 bg-hero-aurora bg-brand-panel text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={24} strokeWidth={2.25} className="text-saffron-400" />
            <span className="font-serif text-xl tracking-wide">Atithi AI</span>
          </div>
          <p className="text-white/50 text-xs">Hotel Command Center</p>
        </div>

        <div className="p-4 space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active tone="saffron" />
          <SidebarItem icon={User} label="Active Guests" count={124} tone="emerald" />
          <SidebarItem
            icon={Sparkles}
            label="AI Control Center"
            alert={isConflict}
            tone="violet"
          />
          <SidebarItem icon={Bell} label="Service Requests" count={12} tone="sky" />
          <SidebarItem icon={CalendarDays} label="Bookings" tone="teal" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-serif text-ink">
              AI Operations Dashboard
            </h1>
            <p className="text-muted">
              Real-time guest personalization overview
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="light" />
            <div className="glass px-4 py-2 rounded-lg shadow-card flex items-center gap-3">
              <Thermometer size={20} strokeWidth={2.25} className="text-saffron-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted uppercase font-semibold">
                  Live Weather
                </span>
                <span className="text-sm font-medium capitalize text-ink">
                  {weather} (Detecting Context)
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Active AI Interventions"
            value={isConflict || disruptions.length > 0 ? "1" : "0"}
            trend={isConflict || disruptions.length > 0 ? "Requires attention" : "All clear"}
            alert={isConflict || disruptions.length > 0}
          />
          <StatCard title="Redirections made" value={String(impact.lowCrowdChoices)} trend="This session (demo)" />
          <StatCard
            title="Est. local spend redirected"
            value={`₹${impact.localSpendINR.toLocaleString("en-IN")}`}
            trend="Demo estimate"
          />
        </div>

        {/* Destination overview */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-serif mb-1">Destination overview</h2>
          <p className="text-xs text-muted mb-4">
            Estimated crowd by place — demo values, not live data.
          </p>
          <div className="space-y-2">
            {rankedAlternatives()
              .sort((a, b) => b.crowd - a.crowd)
              .map(({ place, crowd, label }) => (
                <div key={place.id} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 truncate text-xs text-brand-700 dark:text-brand-300">
                    {place.name}
                  </span>
                  <div className="flex-1 h-4 rounded-full bg-brand-50 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${label === "High" ? "bg-red-400" : label === "Medium" ? "bg-saffron-500" : "bg-brand-500"}`}
                      style={{ width: `${crowd}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-[10px] font-semibold text-muted">
                    {label} · {crowd}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Guardian action log
              </h3>
              {guardianLog.length === 0 ? (
                <p className="text-xs text-muted">No actions taken yet.</p>
              ) : (
                <ul className="space-y-2">
                  {guardianLog.map((entry) => (
                    <li
                      key={entry.id}
                      className="text-xs text-brand-700 dark:text-brand-300 border-l-2 border-saffron-500 pl-3"
                    >
                      {entry.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Sustainable impact (demo estimate)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-brand-50 p-3">
                  <p className="text-lg font-serif">{impact.lowCrowdChoices}</p>
                  <p className="text-[9px] uppercase text-muted">Redirections</p>
                </div>
                <div className="rounded-xl bg-brand-50 p-3">
                  <p className="text-lg font-serif">{impact.localPicks}</p>
                  <p className="text-[9px] uppercase text-muted">Local/eco</p>
                </div>
                <div className="rounded-xl bg-brand-50 p-3">
                  <p className="text-lg font-serif">₹{impact.localSpendINR.toLocaleString("en-IN")}</p>
                  <p className="text-[9px] uppercase text-muted">Redirected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 card p-6">
            <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
              <User size={20} strokeWidth={2.25} className="text-brand-600" /> Live Guest Activity
            </h2>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${isConflict ? "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50" : isResolved ? "bg-brand-50 border-saffron-500" : "border-line"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-btn text-white flex items-center justify-center font-serif shadow-glow">
                      V
                    </div>
                    <div>
                      <h3 className="font-medium text-ink">
                        Virat Sharma{" "}
                        <span className="text-xs font-normal text-muted bg-brand-50 px-2 py-0.5 rounded ml-2">
                          Room 402
                        </span>
                      </h3>
                      <p className="text-xs text-muted">
                        VIP • Vegetarian • Wellness Focus
                      </p>
                    </div>
                  </div>
                </div>

                {isConflict && (
                  <div className="bg-card p-3 rounded-lg border border-red-100 mt-2">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                      <CloudRain size={16} />{" "}
                      <span className="text-sm font-semibold">
                        Weather Conflict Detected (4:00 PM)
                      </span>
                    </div>
                    <p className="text-sm text-ink mb-2">
                      Outdoor Botanical Garden Walk compromised.
                    </p>
                  </div>
                )}

                {isResolved && (
                  <div className="bg-card p-3 rounded-lg border border-line mt-2">
                    <div className="flex items-center gap-2 text-ink mb-1">
                      <Check size={16} className="text-green-600 dark:text-emerald-400" />{" "}
                      <span className="text-sm font-semibold">
                        Guest accepted AI Alternative
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      Swapped 'Botanical Walk' for 'National Art Museum' due to
                      rain.
                    </p>
                  </div>
                )}

                {!isConflict && !isResolved && (
                  <div className="bg-brand-50 p-3 rounded-lg mt-2">
                    <p className="text-sm text-muted">
                      Enjoying Private City Tour. Next: Lunch at The Courtyard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
              <Bell size={20} strokeWidth={2.25} className="text-coral-500" /> Service Requests
            </h2>
            <div className="space-y-3">
              {[...requests]
                .sort(
                  (a, b) =>
                    (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) ||
                    b.id - a.id,
                )
                .slice(0, 6)
                .map((request) => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-xl border ${request.urgent ? "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50" : "bg-brand-50 border-line"}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-medium text-ink">
                        {request.title}
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        {request.urgent && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-600">
                            Urgent
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${request.status === "Completed" ? "bg-brand-100 dark:bg-brand-500/15 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300" : "bg-[#F5EFE4] text-saffron-600 dark:text-saffron-400"}`}
                        >
                          {request.status}
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted truncate">
                      Room 402 · {request.category}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {request.time}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
