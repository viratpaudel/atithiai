import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  CloudRain,
  Clock,
  User,
  ChevronRight,
  Sparkles,
  BedDouble,
  ShieldAlert,
  MapPin,
  Leaf,
} from "lucide-react";
import { GUEST, AI_ALTERNATIVES } from "../../data/guest";
import { useApp } from "../../context/AppContext";
import IconBadge from "../ui/IconBadge";
import ThemeToggle from "../ui/ThemeToggle";

export default function HomeTab({ setActiveTab }) {
  const {
    weather,
    itinerary,
    showAIIntervention,
    activeDisruption,
    isResolving,
    acceptAlternative,
    keepOriginal,
    acceptDisruptionAlternative,
    keepDisruptionOriginal,
    addRequest,
    guardianLog,
    impact,
    rankedAlternatives,
  } = useApp();
  const guardianAlternatives = activeDisruption && activeDisruption.type !== "rain"
    ? rankedAlternatives().slice(0, 2)
    : [];
  const currentPlan = itinerary.find((item) => item.status === "current");
  return (
    <>
      <div className="home-hero relative min-h-[330px] overflow-hidden bg-hero-aurora bg-hero text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-950/15 to-brand-950/90" />
        <div className="relative flex min-h-[330px] flex-col justify-between px-6 pb-5 pt-11">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                The Aranya House
              </p>
              <p className="mt-1 text-xs text-white/85">
                Monday · October 5, 2026
              </p>
            </div>
          <div className="flex items-center gap-2">
            <ThemeToggle variant="dark" />
            <button
              onClick={() => setActiveTab("profile")}
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur"
            >
              <User size={19} />
            </button>
          </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-saffron-300">
              A slower kind of morning
            </p>
            <h1 className="max-w-[290px] font-serif text-[42px] leading-[0.93]">
              Good morning,
              <br />
              <span className="italic">{GUEST.name}.</span>
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
                Suite 402 · Luxury
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
                {weather === "sunny" ? (
                  <Sun size={12} className="text-saffron-300" />
                ) : (
                  <CloudRain size={12} className="text-blue-200" />
                )}
                {weather === "sunny" ? "24° · Clear" : "19° · Rain"}{" "}
                <span className="text-white/60">Dehradun</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-6 sm:px-6">
          <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setActiveTab("services")}
            className="stagger-item flex items-center justify-between rounded-2xl border border-line bg-card px-3.5 py-3.5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98] min-h-[44px]"
            style={{ animationDelay: "0ms" }}
          >
            <span>
              <span className="block text-[10px] uppercase tracking-wide text-saffron-600 dark:text-saffron-400">
                At your service
              </span>
              <span className="mt-1 block text-xs font-semibold text-ink">
                Room requests
              </span>
            </span>
            <IconBadge icon={BedDouble} tone="sky" size="md" />
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className="stagger-item flex items-center justify-between rounded-2xl border border-line bg-card px-3.5 py-3.5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98] min-h-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            <span>
              <span className="block text-[10px] uppercase tracking-wide text-saffron-600 dark:text-saffron-400">
                Your companion
              </span>
              <span className="mt-1 block text-xs font-semibold text-ink">
                Ask concierge
              </span>
            </span>
            <IconBadge icon={Sparkles} tone="saffron" size="md" />
          </button>
        </div>
        <AnimatePresence mode="popLayout">
          {!showAIIntervention && !isResolving && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card rounded-2xl p-5 shadow-card border border-line overflow-hidden"
            >
              <div className="accent-strip absolute top-0 left-0 right-0" />
              <div className="flex gap-3">
                <IconBadge
                  icon={Sparkles}
                  tone={weather === "sunny" ? "saffron" : "sky"}
                  size="md"
                  pulse={weather !== "sunny"}
                />
                <div>
                  <p className="text-ink leading-relaxed">
                    {weather === "sunny"
                      ? "We've planned a relaxed morning followed by your city tour. Your plans are looking perfect for today's weather."
                      : "I've updated your schedule for the rain. Enjoy a cozy afternoon indoors."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAIIntervention && activeDisruption && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-brand-950 rounded-2xl overflow-hidden shadow-lift"
            >
              <div className="accent-strip" />
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-saffron-300">
                    {activeDisruption.type === "rain" ? (
                      <CloudRain size={20} strokeWidth={2.25} />
                    ) : (
                      <ShieldAlert size={20} strokeWidth={2.25} />
                    )}
                    <span className="text-sm font-medium tracking-wide uppercase">
                      {activeDisruption.type === "rain" ? "Weather Alert" : "Trip Guardian"}
                    </span>
                  </div>
                  {activeDisruption.source === "demo" && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/60">
                      Demo event
                    </span>
                  )}
                </div>
                <p className="text-white text-lg font-serif mb-2 leading-snug">
                  {activeDisruption.title}.
                </p>
                <p className="text-white/70 text-sm">
                  {activeDisruption.type === "rain"
                    ? "Your outdoor Botanical Garden Walk will be affected. I've found suitable indoor alternatives based on your preference for Cultural and Wellness activities."
                    : "The route to your next plan is affected. Here are two safer, quieter alternatives I can move you to — I'll inform the driver and hotel automatically."}
                </p>
              </div>

              <div className="p-5 bg-brand-950 space-y-3">
                {isResolving ? (
                  <div className="py-8 flex flex-col items-center justify-center text-white/70">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    >
                      <Sparkles size={24} className="text-saffron-400" />
                    </motion.div>
                    <p className="mt-3 text-sm">Updating your itinerary...</p>
                  </div>
                ) : (
                  <>
                    {activeDisruption.type === "rain"
                      ? AI_ALTERNATIVES.map((alt) => (
                          <button
                            key={alt.id}
                            onClick={() => acceptAlternative(alt)}
                            className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group flex items-start gap-4"
                          >
                            <IconBadge icon={alt.icon} tone="saffron" size="sm" />
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {alt.title}
                              </h4>
                              <p className="text-white/50 text-xs mb-2">
                                {alt.desc}
                              </p>
                              <span className="text-[10px] uppercase tracking-wider text-saffron-500 font-semibold bg-saffron-500/10 px-2 py-1 rounded">
                                {alt.match}
                              </span>
                            </div>
                          </button>
                        ))
                      : guardianAlternatives.map(({ place, label }) => (
                          <button
                            key={place.id}
                            onClick={() => acceptDisruptionAlternative({ place })}
                            className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group flex items-start gap-4"
                          >
                            <IconBadge icon={MapPin} tone="teal" size="sm" />
                            <div>
                              <h4 className="text-white font-medium mb-1">
                                {place.name}
                              </h4>
                              <p className="text-white/50 text-xs mb-2">
                                {place.shortDesc}
                              </p>
                              <span className="text-[10px] uppercase tracking-wider text-saffron-500 font-semibold bg-saffron-500/10 px-2 py-1 rounded">
                                {place.travelMinutes} min · crowd {label.toLowerCase()} (estimated)
                              </span>
                            </div>
                          </button>
                        ))}
                    <button
                      onClick={
                        activeDisruption.type === "rain"
                          ? keepOriginal
                          : keepDisruptionOriginal
                      }
                      className="w-full text-center text-white/50 text-sm py-2 mt-2 hover:text-white transition-colors"
                    >
                      Keep original plan
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(guardianLog.length > 0 || impact.lowCrowdChoices > 0) && (
          <div className="bg-card rounded-2xl p-5 shadow-card border border-line">
            {guardianLog.length > 0 && (
              <>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  <ShieldAlert size={16} strokeWidth={2.25} className="text-coral-500" /> Actions taken by Atithi
                </h3>
                <ul className="space-y-2 mb-4">
                  {guardianLog.map((entry) => (
                    <li key={entry.id} className="text-xs text-brand-700 dark:text-brand-300 border-l-2 border-saffron-500 pl-3">
                      {entry.text}
                      <span className="ml-2 text-[9px] text-muted">{entry.time}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {impact.lowCrowdChoices > 0 && (
              <>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  <Leaf size={16} strokeWidth={2.25} className="text-emerald-500" /> Your sustainable impact
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-brand-50 p-3">
                    <p className="text-lg font-serif text-ink">{impact.lowCrowdChoices}</p>
                    <p className="text-[9px] uppercase tracking-wide text-muted">Low-crowd picks</p>
                  </div>
                  <div className="rounded-xl bg-brand-50 p-3">
                    <p className="text-lg font-serif text-ink">{impact.localPicks}</p>
                    <p className="text-[9px] uppercase tracking-wide text-muted">Local/eco picks</p>
                  </div>
                  <div className="rounded-xl bg-brand-50 p-3">
                    <p className="text-lg font-serif text-ink">₹{impact.localSpendINR.toLocaleString("en-IN")}</p>
                    <p className="text-[9px] uppercase tracking-wide text-muted">Est. local spend</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] text-muted">Demo estimate — not live data.</p>
              </>
            )}
          </div>
        )}

        {currentPlan && (
          <section className="overflow-hidden rounded-2xl bg-hero-aurora bg-brand-panel text-white shadow-lift">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron-400">
                <Clock size={16} strokeWidth={2.25} /> Next up
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold">
                {currentPlan.time}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wide text-white/55">
                Your morning, thoughtfully planned
              </p>
              <h2 className="mt-1 font-serif text-[25px] leading-tight">
                {currentPlan.title}
              </h2>
              <p className="mt-1 text-xs text-white/70">
                {currentPlan.location || currentPlan.desc} ·{" "}
                {currentPlan.duration || "Curated for you"}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/8 p-3">
                  <p className="text-[9px] uppercase tracking-wide text-white/50">
                    Your guide
                  </p>
                  <p className="mt-1 text-[11px] font-semibold">
                    {currentPlan.host || "Your local host"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/8 p-3">
                  <p className="text-[9px] uppercase tracking-wide text-white/50">
                    Meet here
                  </p>
                  <p className="mt-1 text-[11px] font-semibold">
                    {currentPlan.pickup || "Hotel lobby"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  addRequest({
                    title: "Tour pickup confirmation",
                    category: "Valet / Transport",
                    detail: `${currentPlan.pickup || "Hotel lobby"} · ${currentPlan.location || currentPlan.title}`,
                  })
                }
                className="min-h-[44px] mt-3 flex w-full items-center justify-between rounded-xl bg-primary-btn px-3.5 py-2.5 text-left text-[11px] font-bold text-white shadow-glow active:scale-[0.98] transition-transform"
              >
                Confirm my pickup <ChevronRight size={15} />
              </button>
            </div>
          </section>
        )}

        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-serif text-2xl text-ink">Today's Stay</h2>
            <span className="text-sm font-medium text-muted">
              October 5, 2026
            </span>
          </div>

          <div className="relative border-l-2 border-line ml-4 space-y-8 pb-4">
            <AnimatePresence>
              {itinerary.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-6"
                >
                  <div
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                      item.status === "completed"
                        ? "bg-muted border-muted"
                        : item.status === "current"
                          ? "bg-brand-900 border-brand-900"
                          : item.isVulnerableToWeather && weather === "rainy"
                            ? "bg-card border-red-500 animate-pulse"
                            : "bg-card border-line"
                    }`}
                  />

                  <div
                    className={`
                    rounded-2xl p-4 transition-all
                    ${item.status === "current" ? "bg-card shadow-md border border-line" : ""}
                    ${item.isVulnerableToWeather && weather === "rainy" ? "bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50" : ""}
                  `}
                  >
                    <p
                      className={`text-xs font-semibold tracking-wider mb-1 ${
                        item.status === "completed"
                          ? "text-muted"
                          : item.status === "current"
                            ? "text-saffron-500"
                            : item.isVulnerableToWeather && weather === "rainy"
                              ? "text-red-500 dark:text-red-400"
                              : "text-muted"
                      }`}
                    >
                      {item.time}
                    </p>
                    <h3
                      className={`font-medium text-lg mb-1 ${item.status === "completed" ? "text-muted line-through" : "text-ink"}`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted leading-snug">
                      {item.desc}
                    </p>

                    {item.aiAdjusted && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-saffron-500 bg-saffron-500/10 px-2 py-1 rounded-md">
                        <Sparkles size={12} /> Adjusted by AI
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-4 border-t border-line">
          <h2 className="font-serif text-2xl text-ink mb-4">
            Tonight's Dining
          </h2>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-line">
            <div className="w-full h-32 rounded-xl bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mb-4" />
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">Saffron Heritage Room</h3>
              <span className="bg-brand-900 text-white text-xs px-2 py-1 rounded">
                Booked
              </span>
            </div>
            <p className="text-sm text-muted mb-4 border-l-2 border-saffron-500 pl-3 italic">
              "Recommended because you prefer quiet, vegetarian fine-dining.
              Chef Anand has prepared a custom tasting menu."
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  addRequest({
                    title: "Saffron tasting menu",
                    category: "In-Room Dining",
                    detail: "Vegetarian tasting menu for tonight at 7:30 PM",
                  })
                }
                className="btn-primary flex-1"
              >
                View Custom Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
