import { useState } from "react";
import {
  Clock,
  Sparkles,
  ChevronRight,
  Check,
  Sun,
  BedDouble,
  Utensils,
  Bath,
  Car,
  MessageSquare,
  X,
} from "lucide-react";

export default function ServicesTab({ requests, onRequest, setActiveTab }) {
  const services = [
    {
      icon: BedDouble,
      name: "Housekeeping",
      detail: "Fresh towels, turndown & more",
      eta: "~15 min",
    },
    {
      icon: Utensils,
      name: "In-Room Dining",
      detail: "Seasonal dishes, delivered warm",
      eta: "~30 min",
    },
    {
      icon: Bath,
      name: "Spa Booking",
      detail: "Restore with a signature ritual",
      eta: "View times",
    },
    {
      icon: Car,
      name: "Valet / Transport",
      detail: "Your next ride, taken care of",
      eta: "~8 min",
    },
    {
      icon: Clock,
      name: "Wake-up Call",
      detail: "A gentle start, right on time",
      eta: "Set time",
    },
    {
      icon: MessageSquare,
      name: "Reception",
      detail: "A member of our team, anytime",
      eta: "24 hours",
    },
  ];
  const [selectedService, setSelectedService] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const sendRequest = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onRequest({
      title:
        selectedService === "Wake-up Call"
          ? `Wake-up call · ${form.get("time")}`
          : selectedService,
      category: selectedService,
      detail: `${form.get("detail") || "Requested for Room 402"} · ${form.get("time")}`,
    });
    setConfirmation(`${selectedService} request sent`);
    setSelectedService(null);
    window.setTimeout(() => setConfirmation(""), 2500);
  };
  return (
    <div className="services-page px-5 pt-8 pb-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#233D35] text-[#E7C99C]">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#827D73]">
              The Aranya House
            </p>
            <p className="text-xs font-semibold text-[#293C34]">
              Guest services
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[#DCD6CB] bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#5C645C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#73927D]" />
          Here for you
        </span>
      </div>

      <div className="mb-5 flex items-end justify-between gap-2">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9B7C53]">
            Monday · October 5
          </p>
          <h1 className="font-serif text-[34px] leading-none text-[#202A26]">
            Make yourself
            <br />
            at home.
          </h1>
        </div>
        <div className="pb-1 text-right">
          <p className="text-xs text-[#77766E]">Dehradun</p>
          <p className="mt-1 flex items-center justify-end gap-1 text-sm font-medium text-[#293C34]">
            <Sun size={14} className="text-[#B38A53]" /> 24°
          </p>
        </div>
      </div>

      <div className="stay-summary mb-7 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <BedDouble size={19} className="text-[#E7C99C]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">
              Your room
            </p>
            <p className="truncate text-sm font-semibold">
              402{" "}
              <span className="font-normal text-white/60">· Luxury Suite</span>
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/15" />
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/60">
            Check out
          </p>
          <p className="text-sm font-semibold">
            Oct 7 <span className="font-normal text-white/60">· 2 nights</span>
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-[23px] leading-tight text-[#202A26]">
            At your service
          </h2>
          <p className="mt-1 text-xs text-[#79776F]">
            A few thoughtful touches, whenever you need.
          </p>
        </div>
        <span className="pb-1 text-[10px] uppercase tracking-[0.12em] text-[#9B7C53]">
          01 — 06
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((svc) => (
          <button
            key={svc.name}
            onClick={() => setSelectedService(svc.name)}
            className="service-tile group min-h-[140px] rounded-2xl border border-[#E4DED3] bg-[#FFFEFC] p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#B69A70] hover:shadow-[0_12px_24px_rgba(38,51,43,0.08)]"
          >
            <span className="mb-3 flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EEE7] text-[#31483E] transition-colors group-hover:bg-[#31483E] group-hover:text-[#E7C99C]">
                <svc.icon size={18} />
              </span>
              <ChevronRight
                size={15}
                className="text-[#B7B0A4] transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="block text-[13px] font-semibold leading-tight text-[#25332D]">
              {svc.name}
            </span>
            <span className="mt-1 block min-h-8 text-[10px] leading-[1.45] text-[#89857C]">
              {svc.detail}
            </span>
            <span className="mt-1 inline-flex rounded-full bg-[#F4F1EA] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#92754F]">
              {svc.eta}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setActiveTab("ai")}
        className="concierge-banner mt-5 flex w-full items-center justify-between rounded-2xl p-4.5 text-left text-white transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#E7C99C]">
            <Sparkles size={18} />
          </span>
          <span>
            <span className="block font-serif text-[17px] text-[#E7C99C]">
              A little extra?
            </span>
            <span className="mt-0.5 block text-[10px] text-white/65">
              Your personal concierge is one message away.
            </span>
          </span>
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
          <ChevronRight size={17} className="text-[#E7C99C]" />
        </span>
      </button>
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B7C53]">
              In good hands
            </p>
            <h2 className="mt-0.5 font-serif text-[23px] leading-tight text-[#202A26]">
              Your requests
            </h2>
          </div>
          <span className="rounded-full bg-[#EDE9E0] px-2.5 py-1 text-[10px] font-semibold text-[#62685F]">
            {
              requests.filter((request) => request.status !== "Completed")
                .length
            }{" "}
            open · {requests.length} total
          </span>
        </div>
        <div className="space-y-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="request-row rounded-xl border border-[#E5E0D8] bg-white/90 px-3.5 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2EFE8] text-[#45594C]">
                  {request.status === "Completed" ? (
                    <Check size={15} />
                  ) : (
                    <Clock size={15} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-[#29352F]">
                      {request.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {request.urgent && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[9px] font-semibold text-red-600">
                          Urgent
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${request.status === "Completed" ? "bg-[#EAF1E8] text-[#54705B]" : "bg-[#F5EFE4] text-[#9A7545]"}`}
                      >
                        {request.status}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-[#77766E]">
                    {request.category} · {request.detail}
                  </p>
                  <p className="mt-1.5 text-[9px] uppercase tracking-wide text-[#A19B8F]">
                    {request.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {confirmation && (
        <p
          role="status"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] bg-[#1C1C1C] text-white text-sm px-4 py-3 rounded-xl shadow-lg"
        >
          {confirmation}
        </p>
      )}
      {selectedService && (
        <div
          className="fixed inset-0 z-[70] bg-black/45 p-5 flex items-center justify-center"
          onClick={() => setSelectedService(null)}
        >
          <form
            role="dialog"
            aria-modal="true"
            onSubmit={sendRequest}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm bg-[#F7F5F2] rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs uppercase text-[#9A7A4F]">Room 402</p>
                <h2 className="font-serif text-2xl">{selectedService}</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedService(null)}
              >
                <X size={18} />
              </button>
            </div>
            <label className="block mt-4 text-xs font-semibold text-[#6B655C]">
              DETAILS
              <input
                name="detail"
                placeholder="What should the team prepare?"
                className="w-full mt-2 p-3 rounded-xl border border-[#E5E0D8] bg-white text-sm font-normal"
              />
            </label>
            {selectedService === "Wake-up Call" ? (
              <label className="block mt-4 text-xs font-semibold text-[#6B655C]">
                CALL TIME
                <input
                  name="time"
                  type="time"
                  defaultValue="07:00"
                  required
                  className="w-full mt-2 p-3 rounded-xl border border-[#E5E0D8] bg-white text-sm font-normal"
                />
              </label>
            ) : (
              <label className="block mt-4 text-xs font-semibold text-[#6B655C]">
                WHEN
                <select
                  name="time"
                  className="w-full mt-2 p-3 rounded-xl border border-[#E5E0D8] bg-white text-sm font-normal"
                >
                  <option>As soon as possible</option>
                  <option>In 30 minutes</option>
                  <option>At 6:00 PM</option>
                  <option>Tomorrow morning</option>
                </select>
              </label>
            )}
            <button
              type="submit"
              className="w-full mt-5 bg-[#1C1C1C] text-white py-3 rounded-xl text-sm font-medium"
            >
              Send request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
