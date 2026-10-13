import { useState } from "react";
import { MapPin, ChevronRight, Search, X, Leaf } from "lucide-react";
import { EXPERIENCES } from "../../data/guest";
import PLACES, { getCrowd, crowdLabel } from "../../data/places";
import { useApp } from "../../context/AppContext";

const BADGE_STYLES = {
  Low: "bg-[#EAF1E8] text-[#54705B]",
  Medium: "bg-[#F5EFE4] text-[#9A7545]",
  High: "bg-red-100 text-red-600",
};

export default function DiscoverTab({ onRequest }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [beatCrowds, setBeatCrowds] = useState(false);
  const [suggestedSwap, setSuggestedSwap] = useState(null);
  const { addImpact } = useApp();
  const categories = ["All", "Wellness", "Dining", "Culture"];
  const places = [...PLACES]
    .map((place) => ({
      place,
      crowd: getCrowd(place),
      label: crowdLabel(getCrowd(place)),
    }))
    .sort((a, b) => (beatCrowds ? a.crowd - b.crowd : b.crowd - a.crowd));
  const filtered = EXPERIENCES.filter(
    (experience) =>
      (category === "All" || experience.category === category) &&
      `${experience.title} ${experience.desc}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="px-5 pb-8 pt-8 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7C53]">
            The local edit · No. 05
          </p>
          <h1 className="font-serif text-[34px] leading-none text-[#202A26]">
            Discover
            <br />
            <span className="italic">Dehradun.</span>
          </h1>
        </div>
        <span className="mb-1 flex items-center gap-1 text-xs text-[#73766D]">
          <MapPin size={13} className="text-[#9B7C53]" /> 30.3165° N
        </span>
      </div>
      <button
        onClick={() => setSelected(EXPERIENCES[3])}
        className="discover-feature relative mb-5 flex h-[218px] w-full items-end overflow-hidden rounded-2xl bg-[#263E35] text-left text-white shadow-lg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]"
          style={{ backgroundImage: `url(${EXPERIENCES[3].img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14251F]/95 via-[#14251F]/25 to-transparent" />
        <div className="relative w-full p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
              Outside the ordinary · {EXPERIENCES[3].category}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-[#263E35]">
              ★ {EXPERIENCES[3].rating}
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-[26px] leading-none">
                Breathe beyond the city
              </h2>
              <p className="mt-1.5 text-[10px] text-white/75">
                {EXPERIENCES[3].location} · {EXPERIENCES[3].duration}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#E7C99C] px-3 py-2 text-[10px] font-bold text-[#263E35]">
              Explore <ChevronRight size={13} className="ml-1 inline" />
            </span>
          </div>
        </div>
      </button>
      <label className="relative block mb-4">
        <Search size={17} className="absolute left-3 top-3 text-[#8C857B]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search experiences"
          className="w-full bg-white border border-[#E5E0D8] rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#BCA37F]"
        />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${category === item ? "bg-[#1C1C1C] text-white" : "bg-white border border-[#E5E0D8] text-[#6B655C]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#9B7C53]">
            Chosen for you
          </p>
          <h2 className="font-serif text-[22px] leading-tight text-[#202A26]">
            A little more local
          </h2>
        </div>
        <span className="text-[10px] text-[#858177]">
          {filtered.length} experiences
        </span>
      </div>
      <div className="space-y-3 pb-8">
        {filtered.map((experience) => (
          <article
            key={experience.id}
            className="flex overflow-hidden rounded-2xl border border-[#E4DED3] bg-white shadow-sm"
          >
            <div
              className="w-[104px] shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${experience.img})` }}
            />
            <div className="min-w-0 flex-1 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A7A4F]">
                  {experience.category} · {experience.duration}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-[#536B58]">
                  ★ {experience.rating}
                </span>
              </div>
              <h3 className="mt-1 font-serif text-[18px] leading-tight text-[#26362E]">
                {experience.title}
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-[#77766E]">
                {experience.location}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-[10px] font-semibold text-[#3F4D44]">
                  {experience.time}
                </span>
                <button
                  onClick={() => setSelected(experience)}
                  className="shrink-0 text-[10px] font-bold text-[#9A7545]"
                >
                  Details <ChevronRight size={12} className="inline" />
                </button>
              </div>
              <p className="mt-1 text-[9px] text-[#89857C]">
                {experience.price} · {experience.availability}
              </p>
              <p className="sr-only">{experience.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#9B7C53]">
              Nearby places · crowd levels estimated
            </p>
            <h2 className="font-serif text-[22px] leading-tight text-[#202A26]">
              Beat the crowds
            </h2>
          </div>
          <button
            role="switch"
            aria-checked={beatCrowds}
            onClick={() => setBeatCrowds((value) => !value)}
            className={`relative h-6 w-11 rounded-full transition-colors ${beatCrowds ? "bg-[#54705B]" : "bg-[#D8D2C6]"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${beatCrowds ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </div>
        {beatCrowds && (
          <p className="mb-3 flex items-center gap-1.5 text-[10px] text-[#54705B]">
            <Leaf size={12} /> Sorted by lowest estimated crowd — quieter spots
            redirect your spend to the local community.
          </p>
        )}
        <div className="space-y-2">
          {places.map(({ place, label }) => {
            const suggestSwap =
              suggestedSwap?.place.id === place.id &&
              crowdLabel(getCrowd(suggestedSwap.from)) === "High";
            return (
              <div
                key={place.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E4DED3] bg-white px-3.5 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-[#29352F]">
                      {place.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${BADGE_STYLES[label]}`}
                    >
                      {label} · est.
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-[#77766E]">
                    {place.category} · {place.travelMinutes} min from hotel ·{" "}
                    {place.shortDesc}
                  </p>
                  {suggestSwap && (
                    <p className="mt-1.5 text-[10px] font-medium text-[#54705B]">
                      +₹{place.localSpendINR.toLocaleString("en-IN")} estimated to
                      local community
                    </p>
                  )}
                </div>
                {suggestSwap ? (
                  <button
                    onClick={() => {
                      addImpact(place);
                      setSuggestedSwap(null);
                    }}
                    className="shrink-0 rounded-full bg-[#1C1C1C] px-3 py-2 text-[10px] font-bold text-white"
                  >
                    Add
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (label !== "High") return;
                      const low = PLACES.map((p) => ({
                        place: p,
                        label: crowdLabel(getCrowd(p)),
                      }))
                        .filter((p) => p.place.id !== place.id && p.label === "Low")
                        .sort((a, b) => a.place.travelMinutes - b.place.travelMinutes)[0];
                      if (low) setSuggestedSwap({ from: place, place: low.place });
                    }}
                    disabled={label !== "High"}
                    className={`shrink-0 text-[10px] font-bold ${label === "High" ? "text-[#9A7545]" : "text-[#C9C3B8]"}`}
                  >
                    Alternative <ChevronRight size={12} className="inline" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[9px] text-[#A19B8F]">
          All crowd levels are demo estimates — not live data.
        </p>
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-[70] bg-black/45 p-5 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm bg-[#F7F5F2] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${selected.img})` }}
            />
            <div className="p-5">
              <div className="flex justify-between">
                <span className="text-xs uppercase text-[#9A7A4F] font-semibold">
                  {selected.category}
                </span>
                <button aria-label="Close" onClick={() => setSelected(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="mt-2 flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl leading-tight">
                  {selected.title}
                </h2>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#EAF1E8] px-2 py-1 text-[10px] font-bold text-[#536B58]">
                  ★ {selected.rating}
                </span>
              </div>
              <p className="text-sm text-[#6B655C] mt-2">{selected.desc}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-white p-3 text-xs">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[#9B7C53]">
                    When
                  </p>
                  <p className="mt-1 font-semibold">{selected.time}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[#9B7C53]">
                    Duration
                  </p>
                  <p className="mt-1 font-semibold">{selected.duration}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[#9B7C53]">
                    Where
                  </p>
                  <p className="mt-1 font-semibold">{selected.location}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-[#9B7C53]">
                    From
                  </p>
                  <p className="mt-1 font-semibold">{selected.price}</p>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-[#6B655C]">
                {selected.availability}
              </p>
              <button
                onClick={() => {
                  onRequest({
                    title: selected.title,
                    category: "Experience booking",
                    detail: `${selected.time} · ${selected.location} · ${selected.price}`,
                  });
                  setSelected(null);
                }}
                className="w-full mt-5 bg-[#1C1C1C] text-white py-3 rounded-xl text-sm font-medium"
              >
                Request reservation
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
