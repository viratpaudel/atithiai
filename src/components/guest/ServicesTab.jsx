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

import IconBadge from "../ui/IconBadge";

export default function ServicesTab({ requests, onRequest, setActiveTab }) {
  const services = [
    {
      icon: BedDouble,
      tone: "sky",
      name: "Housekeeping",
      detail: "Fresh towels, turndown & more",
      eta: "~15 min",
    },
    {
      icon: Utensils,
      tone: "saffron",
      name: "In-Room Dining",
      detail: "Seasonal dishes, delivered warm",
      eta: "~30 min",
    },
    {
      icon: Bath,
      tone: "violet",
      name: "Spa Booking",
      detail: "Restore with a signature ritual",
      eta: "View times",
    },
    {
      icon: Car,
      tone: "teal",
      name: "Valet / Transport",
      detail: "Your next ride, taken care of",
      eta: "~8 min",
    },
    {
      icon: Clock,
      tone: "emerald",
      name: "Wake-up Call",
      detail: "A gentle start, right on time",
      eta: "Set time",
    },
    {
      icon: MessageSquare,
      tone: "coral",
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
          <IconBadge icon={Sparkles} tone="saffron" size="md" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
              The Aranya House
            </p>
            <p className="text-xs font-semibold text-ink">
              Guest services
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-card/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Here for you
        </span>
      </div>

      <div className="mb-5 flex items-end justify-between gap-2">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-saffron-600 dark:text-saffron-400">
            Monday · October 5
          </p>
          <h1 className="font-serif text-[34px] leading-none text-ink">
            Make yourself
            <br />
            at home.
          </h1>
        </div>
        <div className="pb-1 text-right">
          <p className="text-xs text-muted">Dehradun</p>
          <p className="mt-1 flex items-center justify-end gap-1 text-sm font-medium text-ink">
            <Sun size={14} className="text-saffron-600 dark:text-saffron-400" /> 24°
          </p>
        </div>
      </div>

      <div className="stay-summary mb-7 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <IconBadge icon={BedDouble} tone="teal" size="md" />
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
          <h2 className="font-serif text-[23px] leading-tight text-ink">
            At your service
          </h2>
          <p className="mt-1 text-xs text-muted">
            A few thoughtful touches, whenever you need.
          </p>
        </div>
        <span className="pb-1 text-[10px] uppercase tracking-[0.12em] text-saffron-600 dark:text-saffron-400">
          01 — 06
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((svc) => (
          <button
            key={svc.name}
            onClick={() => setSelectedService(svc.name)}
            className="service-tile group min-h-[140px] rounded-2xl border border-line bg-card p-3.5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-saffron-500 hover:shadow-lift active:scale-[0.98] min-h-[44px]"
          >
            <span className="mb-3 flex items-center justify-between">
              <IconBadge icon={svc.icon} tone={svc.tone} size="md" />
              <ChevronRight
                size={15}
                className="text-muted transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="block text-[13px] font-semibold leading-tight text-ink">
              {svc.name}
            </span>
            <span className="mt-1 block min-h-8 text-[10px] leading-[1.45] text-muted">
              {svc.detail}
            </span>
            <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-saffron-600 dark:text-saffron-400">
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
          <IconBadge icon={Sparkles} tone="saffron" size="md" />
          <span>
            <span className="block font-serif text-[17px] text-saffron-400">
              A little extra?
            </span>
            <span className="mt-0.5 block text-[10px] text-white/65">
              Your personal concierge is one message away.
            </span>
          </span>
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
          <ChevronRight size={17} className="text-saffron-400" />
        </span>
      </button>
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-saffron-600 dark:text-saffron-400">
              In good hands
            </p>
            <h2 className="mt-0.5 font-serif text-[23px] leading-tight text-ink">
              Your requests
            </h2>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-muted">
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
              className="request-row rounded-xl border border-line bg-card/90 px-3.5 py-3"
            >
              <div className="flex items-start gap-3">
                <IconBadge
                  icon={request.status === "Completed" ? Check : Clock}
                  tone={request.status === "Completed" ? "emerald" : "sky"}
                  size="sm"
                  pulse={request.urgent}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-ink">
                      {request.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {request.urgent && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[9px] font-semibold text-red-600">
                          Urgent
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${request.status === "Completed" ? "bg-brand-100 dark:bg-brand-500/15 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300" : "bg-[#F5EFE4] text-saffron-600 dark:text-saffron-400"}`}
                      >
                        {request.status}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-muted">
                    {request.category} · {request.detail}
                  </p>
                  <p className="mt-1.5 text-[9px] uppercase tracking-wide text-muted">
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
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] bg-brand-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg"
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
            className="w-full max-w-sm bg-surface rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs uppercase text-saffron-600 dark:text-saffron-400">Room 402</p>
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
            <label className="block mt-4 text-xs font-semibold text-muted">
              DETAILS
              <input
                name="detail"
                placeholder="What should the team prepare?"
                className="w-full mt-2 p-3 rounded-xl border border-line bg-card text-sm font-normal"
              />
            </label>
            {selectedService === "Wake-up Call" ? (
              <label className="block mt-4 text-xs font-semibold text-muted">
                CALL TIME
                <input
                  name="time"
                  type="time"
                  defaultValue="07:00"
                  required
                  className="w-full mt-2 p-3 rounded-xl border border-line bg-card text-sm font-normal"
                />
              </label>
            ) : (
              <label className="block mt-4 text-xs font-semibold text-muted">
                WHEN
                <select
                  name="time"
                  className="w-full mt-2 p-3 rounded-xl border border-line bg-card text-sm font-normal"
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
              className="w-full mt-5 btn-primary"
            >
              Send request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
