import { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Settings,
  CreditCard,
  Bell,
  Moon,
  X,
} from "lucide-react";
import { GUEST } from "../../data/guest";
import ProfileToggle from "./ProfileToggle";
import IconBadge from "../ui/IconBadge";
import ThemeToggle from "../ui/ThemeToggle";

export default function ProfileTab() {
  const [diet, setDiet] = useState("Vegetarian");
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [openPanel, setOpenPanel] = useState("");
  return (
    <div className="profile-page px-5 pt-8 pb-8 sm:px-6">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-saffron-600 dark:text-saffron-400">
        Your private stay
      </p>
      <h1 className="mb-5 font-serif text-[34px] leading-none text-ink">
        The guest book.
      </h1>
      <div className="profile-pass relative mb-5 overflow-hidden rounded-2xl p-5 text-white shadow-lg">
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Atithi · Private guest
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-saffron-400/60 bg-white/5 font-serif text-2xl text-saffron-400">
                V
              </div>
              <div>
                <h2 className="font-serif text-[25px] leading-none">
                  {GUEST.name} {GUEST.lastName}
                </h2>
                <p className="mt-1.5 text-[10px] text-white/65">{GUEST.room}</p>
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-saffron-400/35 bg-white/5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide text-saffron-400">
            <ShieldCheck size={12} /> Signature
          </span>
        </div>
        <div className="relative mt-5 flex items-center justify-between border-t border-white/15 pt-3">
          <span className="text-[9px] uppercase tracking-[0.16em] text-white/55">
            Guest since · 2022
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-saffron-400">
            No. 00402 · Dehradun
          </span>
        </div>
      </div>
      <section className="mb-6 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-saffron-600 dark:text-saffron-400">
              October 3 – 7, 2026
            </p>
            <h2 className="mt-0.5 font-serif text-[20px] text-ink">
              Your stay
            </h2>
          </div>
          <span className="rounded-full bg-brand-100 dark:bg-brand-500/15 px-2.5 py-1 text-[9px] font-semibold text-brand-700 dark:text-brand-300">
            In residence
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-line">
          <div className="pr-2">
            <p className="text-[9px] uppercase tracking-wide text-muted">
              Room
            </p>
            <p className="mt-1 text-xs font-semibold text-ink">
              402 Suite
            </p>
          </div>
          <div className="px-3">
            <p className="text-[9px] uppercase tracking-wide text-muted">
              Guests
            </p>
            <p className="mt-1 text-xs font-semibold text-ink">
              2 adults
            </p>
          </div>
          <div className="pl-3">
            <p className="text-[9px] uppercase tracking-wide text-muted">
              Nights
            </p>
            <p className="mt-1 text-xs font-semibold text-ink">
              4 nights
            </p>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          AI Personalization
        </h3>
        <div className="bg-card rounded-2xl border border-line overflow-hidden">
          <button
            onClick={() => setOpenPanel("preferences")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-50"
          >
            <span className="flex items-center gap-3">
              <IconBadge icon={Sparkles} tone="violet" size="sm" />
              <span className="text-sm font-medium">Diet & interests</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-muted">
              {diet} <ChevronRight size={16} />
            </span>
          </button>
          <div className="border-t border-line" />
          <ProfileToggle
            icon={Settings}
            label="Auto-adjust plans"
            tone="violet"
            checked={autoAdjust}
            onChange={() => setAutoAdjust((value) => !value)}
          />
          <div className="border-t border-line" />
          <div className="flex items-center justify-between p-4">
            <span className="flex items-center gap-3">
              <IconBadge icon={Moon} tone="teal" size="sm" />
              <span className="text-sm font-medium">Appearance</span>
            </span>
            <ThemeToggle variant="light" />
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          Account Settings
        </h3>
        <div className="bg-card rounded-2xl border border-line overflow-hidden">
          <button
            onClick={() => setOpenPanel("payment")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-50"
          >
            <span className="flex items-center gap-3">
              <IconBadge icon={CreditCard} tone="saffron" size="sm" />
              <span className="text-sm font-medium">Payment methods</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-muted">
              •••• 2048 <ChevronRight size={16} />
            </span>
          </button>
          <div className="border-t border-line" />
          <ProfileToggle
            icon={Bell}
            label="Notifications"
            tone="saffron"
            checked={notifications}
            onChange={() => setNotifications((value) => !value)}
          />
        </div>
      </section>
      {openPanel && (
        <div
          className="fixed inset-0 z-[70] bg-black/45 p-5 flex items-center justify-center"
          onClick={() => setOpenPanel("")}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm bg-surface rounded-2xl p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="font-serif text-2xl">
                {openPanel === "preferences"
                  ? "Your preferences"
                  : "Payment methods"}
              </h2>
              <button aria-label="Close" onClick={() => setOpenPanel("")}>
                <X size={18} />
              </button>
            </div>
            {openPanel === "preferences" ? (
              <>
                <label className="block mt-5 text-xs font-semibold text-muted">
                  DIET
                  <select
                    value={diet}
                    onChange={(event) => setDiet(event.target.value)}
                    className="block w-full mt-2 rounded-xl border border-line bg-card px-3 py-3 text-sm font-normal"
                  >
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>No preference</option>
                    <option>Gluten-free</option>
                  </select>
                </label>
                <p className="text-xs text-muted mt-4">
                  Interests: Culture · Wellness · Quiet Dining
                </p>
              </>
            ) : (
              <div className="mt-5 rounded-xl bg-card p-4 border border-line">
                <p className="font-medium text-sm">Visa ending in 2048</p>
                <p className="text-xs text-muted mt-1">
                  Primary payment method · Expires 08/28
                </p>
              </div>
            )}
            <button
              onClick={() => setOpenPanel("")}
              className="w-full mt-5 btn-primary"
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
