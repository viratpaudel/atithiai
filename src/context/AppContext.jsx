import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SUNNY_ITINERARY,
  INITIAL_REQUESTS,
} from "../data/guest";
import PLACES, { getCrowd, crowdLabel } from "../data/places";

const AppContext = createContext(null);

// Rank places for the Guardian: prefer rain-friendly / low-crowd, then closest.
function rankAlternatives() {
  return [...PLACES]
    .map((place) => ({
      place,
      crowd: getCrowd(place),
      label: crowdLabel(getCrowd(place)),
    }))
    .sort((a, b) => {
      const scoreOf = (entry) =>
        (entry.place.tags.includes("rain-friendly") ? -30 : 0) +
        (entry.place.tags.includes("low-crowd") ? -20 : 0) +
        entry.crowd +
        entry.place.travelMinutes / 5;
      return scoreOf(a) - scoreOf(b);
    });
}

export function AppProvider({ children }) {
  const [weather, setWeather] = useState("sunny");
  const [itinerary, setItinerary] = useState(SUNNY_ITINERARY);
  const [isResolving, setIsResolving] = useState(false);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [liveTemp, setLiveTemp] = useState(null);

  // Disruption Guardian state
  const [disruptions, setDisruptions] = useState([]);
  const [guardianLog, setGuardianLog] = useState([]);
  // Sustainable impact counters (demo estimates)
  const [impact, setImpact] = useState({
    lowCrowdChoices: 0,
    localPicks: 0,
    localSpendINR: 0,
  });

  // Manual demo override: once the user clicks the Trigger Rain / Reset button,
  // the live weather fetch must not override their choice for this session.
  const manualOverride = useRef(false);
  const nextId = useRef(1);
  const takeId = () => nextId.current++;

  const addRequest = (request) => {
    setRequests((current) => [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: request.title,
        category: request.category,
        detail: request.detail || "Requested for Room 402",
        urgent: Boolean(request.urgent),
        status: request.urgent ? "Staff dispatched" : "Received",
        time: "Today, just now",
      },
      ...current,
    ]);
  };

  const addItineraryItem = (item) => {
    setItinerary((current) => [
      ...current,
      {
        id: Date.now(),
        time: item.time,
        title: item.title,
        desc: item.desc,
        type: "activity",
        status: "upcoming",
      },
    ]);
  };

  const addGuardianAction = (text) => {
    setGuardianLog((current) => [
      { id: takeId(), text, time: "Today, just now" },
      ...current,
    ]);
  };

  // Record a sustainable-impact choice (demo estimate).
  const addImpact = (place) => {
    if (!place) return;
    setImpact((current) => ({
      lowCrowdChoices:
        current.lowCrowdChoices +
        (place.tags.includes("low-crowd") ||
        crowdLabel(getCrowd(place)) === "Low"
          ? 1
          : 0),
      localPicks:
        current.localPicks +
        (place.tags.includes("local-artisan") ||
        place.tags.includes("eco-friendly")
          ? 1
          : 0),
      localSpendINR: current.localSpendINR + (place.localSpendINR || 0),
    }));
  };

  // --- Disruption Guardian -------------------------------------------------
  const addDisruption = (disruption) => {
    setDisruptions((current) => [
      { id: `dis_${takeId()}`, ...disruption },
      ...current.filter((d) => d.type !== disruption.type),
    ]);
  };

  const clearDisruption = (id) => {
    setDisruptions((current) => current.filter((d) => d.id !== id));
  };

  const simulateDisruption = (type) => {
    const titles = {
      landslide: "Landslide reported on the Mussoorie road",
      roadblock: "Roadblock on the route to Mussoorie",
    };
    addDisruption({
      type,
      title: titles[type] || "Route disruption",
      affectedPlaceIds: ["mall-road-mussoorie", "kempty-falls", "lal-tibba"],
      severity: "high",
      source: "demo",
    });
  };

  // Which itinerary item does a disruption affect? (the current item, or the
  // known 4 PM walk for rain)
  const affectedItineraryId = (disruption) => {
    if (disruption.type === "rain") {
      const walk = itinerary.find((item) => item.isVulnerableToWeather);
      if (walk) return walk.id;
    }
    return itinerary.find((item) => item.status === "current")?.id;
  };

  // The active disruption that currently affects the itinerary (drives the
  // Guardian card on Home, replacing the old showAIIntervention flag).
  const activeDisruption =
    disruptions.find(
      (d) =>
        d.type === "rain"
          ? itinerary.some((item) => item.isVulnerableToWeather)
          : Boolean(affectedItineraryId(d)),
    ) || null;

  const showAIIntervention = Boolean(activeDisruption);

  // Swap an itinerary item for a Guardian alternative (from places.js).
  const acceptDisruptionAlternative = (entry) => {
    const active = activeDisruption;
    if (!active) return;
    setIsResolving(true);
    setTimeout(() => {
      const targetId = affectedItineraryId(active);
      setItinerary((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? {
                ...item,
                title: entry.place.name,
                desc: entry.place.shortDesc,
                isVulnerableToWeather: false,
                aiAdjusted: true,
              }
            : item,
        ),
      );
      // Automatically create the two staff requests.
      addRequest({
        title: `Notify driver: pickup moved to ${entry.place.name}`,
        category: "Valet / Transport",
        detail: `Route changed due to ${active.title.toLowerCase()}`,
      });
      addRequest({
        title: "Hotel: adjust lunch/checkout timing",
        category: "Reception",
        detail: "Itinerary shifted after disruption",
      });
      addGuardianAction(
        `Moved affected plans to ${entry.place.name} (${active.title.toLowerCase()}).`,
      );
      addImpact(entry.place);
      clearDisruption(active.id);
      setIsResolving(false);
    }, 1200);
  };

  const keepDisruptionOriginal = () => {
    const active = activeDisruption;
    if (!active) return;
    addGuardianAction(`Kept original plan despite: ${active.title}.`);
    clearDisruption(active.id);
  };

  useEffect(() => {
    // Live/demo rain creates a "rain" disruption through the same system.
    if (
      weather === "rainy" &&
      itinerary.some((item) => item.isVulnerableToWeather) &&
      !disruptions.some((d) => d.type === "rain")
    ) {
      const timer = setTimeout(() => {
        addDisruption({
          type: "rain",
          title: "Rain is expected around 4:00 PM",
          affectedPlaceIds: [],
          severity: "medium",
          source: "live",
        });
      }, 600);
      return () => clearTimeout(timer);
    }
    if (weather !== "rainy") {
      setDisruptions((current) => current.filter((d) => d.type !== "rain"));
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, itinerary]);

  // Legacy rain accept (keeps AI_ALTERNATIVES working) — routes through the
  // same Guardian bookkeeping.
  const acceptAlternative = (alt) => {
    setIsResolving(true);
    setTimeout(() => {
      setItinerary((prev) =>
        prev.map((item) =>
          item.time === "04:00 PM"
            ? {
                ...item,
                title: alt.title,
                desc: alt.desc,
                isVulnerableToWeather: false,
                icon: alt.icon,
                aiAdjusted: true,
              }
            : item,
        ),
      );
      addRequest({
        title: `Notify driver: pickup moved to ${alt.title}`,
        category: "Valet / Transport",
        detail: "Route changed due to expected rain",
      });
      addRequest({
        title: "Hotel: adjust lunch/checkout timing",
        category: "Reception",
        detail: "Itinerary shifted due to rain",
      });
      addGuardianAction(
        `Swapped Botanical Garden Walk for ${alt.title} due to rain.`,
      );
      setDisruptions((current) => current.filter((d) => d.type !== "rain"));
      setIsResolving(false);
    }, 1200);
  };

  const keepOriginal = () => {
    const rain = disruptions.find((d) => d.type === "rain");
    if (rain) {
      addGuardianAction("Kept original plan despite expected rain.");
      clearDisruption(rain.id);
    }
  };

  // Set weather with manual-override tracking (used by the demo button).
  const setDemoWeather = (next) => {
    manualOverride.current = true;
    setWeather(next);
  };

  // Live weather for Dehradun via Open-Meteo (no key). Fails silently.
  useEffect(() => {
    let cancelled = false;
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=30.3165&longitude=78.0322&current=temperature_2m,precipitation,weather_code&hourly=precipitation_probability&timezone=auto",
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const temp = data?.current?.temperature_2m;
        if (typeof temp === "number") setLiveTemp(Math.round(temp));

        // Never let the live fetch override a manual demo override.
        if (manualOverride.current) return;

        const precipitating = (data?.current?.precipitation ?? 0) > 0;
        const hourly = Array.isArray(data?.hourly?.precipitation_probability)
          ? data.hourly.precipitation_probability
          : [];
        // Closest hour slot to 4 PM (index 16) in the hourly array.
        const afternoonProb = hourly[16] ?? 0;
        if (precipitating || afternoonProb >= 60) {
          setWeather("rainy");
        }
      })
      .catch(() => {
        // Silent failure — demo keeps running on the default sunny state.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        weather,
        setWeather,
        setDemoWeather,
        itinerary,
        setItinerary,
        showAIIntervention,
        activeDisruption,
        isResolving,
        requests,
        addRequest,
        addItineraryItem,
        acceptAlternative,
        keepOriginal,
        liveTemp,
        disruptions,
        simulateDisruption,
        acceptDisruptionAlternative,
        keepDisruptionOriginal,
        guardianLog,
        impact,
        addImpact,
        rankedAlternatives: rankAlternatives,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
