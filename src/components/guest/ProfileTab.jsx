import { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Settings,
  CreditCard,
  Bell,
  X,
} from "lucide-react";
import { GUEST } from "../../data/guest";
import ProfileToggle from "./ProfileToggle";

export default function ProfileTab() {
  const [diet, setDiet] = useState("Vegetarian");
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [openPanel, setOpenPanel] = useState("");
  return (
    <div className="profile-page px-5 pt-8 pb-8 sm:px-6">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7C53]">
        Your private stay
      </p>
      <h1 className="mb-5 font-serif text-[34px] leading-none text-[#202A26]">
        The guest book.
      </h1>
      <div className="profile-pass relative mb-5 overflow-hidden rounded-2xl p-5 text-white shadow-lg">
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Atithi · Private guest
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E7C99C]/60 bg-white/5 font-serif text-2xl text-[#E7C99C]">
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
          <span className="flex items-center gap-1 rounded-full border border-[#E7C99C]/35 bg-white/5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#E7C99C]">
            <ShieldCheck size={12} /> Signature
          </span>
        </div>
        <div className="relative mt-5 flex items-center justify-between border-t border-white/15 pt-3">
          <span className="text-[9px] uppercase tracking-[0.16em] text-white/55">
            Guest since · 2022
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#E7C99C]">
            No. 00402 · Dehradun
          </span>
        </div>
      </div>
      <section className="mb-6 rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9B7C53]">
              October 3 – 7, 2026
            </p>
            <h2 className="mt-0.5 font-serif text-[20px] text-[#26362E]">
              Your stay
            </h2>
          </div>
          <span className="rounded-full bg-[#EAF1E8] px-2.5 py-1 text-[9px] font-semibold text-[#54705B]">
            In residence
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#E8E3D9]">
          <div className="pr-2">
            <p className="text-[9px] uppercase tracking-wide text-[#999388]">
              Room
            </p>
            <p className="mt-1 text-xs font-semibold text-[#293C34]">
              402 Suite
            </p>
          </div>
          <div className="px-3">
            <p className="text-[9px] uppercase tracking-wide text-[#999388]">
              Guests
            </p>
            <p className="mt-1 text-xs font-semibold text-[#293C34]">
              2 adults
            </p>
          </div>
          <div className="pl-3">
            <p className="text-[9px] uppercase tracking-wide text-[#999388]">
              Nights
            </p>
            <p className="mt-1 text-xs font-semibold text-[#293C34]">
              4 nights
            </p>
          </div>
        </div>
      </section>
      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C857B] mb-3">
          AI Personalization
        </h3>
        <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
          <button
            onClick={() => setOpenPanel("preferences")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9F8F6]"
          >
            <span className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#8C857B]" />
              <span className="text-sm font-medium">Diet & interests</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-[#8C857B]">
              {diet} <ChevronRight size={16} />
            </span>
          </button>
          <div className="border-t border-[#E5E0D8]" />
          <ProfileToggle
            icon={Settings}
            label="Auto-adjust plans"
            checked={autoAdjust}
            onChange={() => setAutoAdjust((value) => !value)}
          />
        </div>
      </section>
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C857B] mb-3">
          Account Settings
        </h3>
        <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
          <button
            onClick={() => setOpenPanel("payment")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9F8F6]"
          >
            <span className="flex items-center gap-3">
              <CreditCard size={18} className="text-[#8C857B]" />
              <span className="text-sm font-medium">Payment methods</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-[#8C857B]">
              •••• 2048 <ChevronRight size={16} />
            </span>
          </button>
          <div className="border-t border-[#E5E0D8]" />
          <ProfileToggle
            icon={Bell}
            label="Notifications"
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
            className="w-full max-w-sm bg-[#F7F5F2] rounded-2xl p-5 shadow-2xl"
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
                <label className="block mt-5 text-xs font-semibold text-[#6B655C]">
                  DIET
                  <select
                    value={diet}
                    onChange={(event) => setDiet(event.target.value)}
                    className="block w-full mt-2 rounded-xl border border-[#E5E0D8] bg-white px-3 py-3 text-sm font-normal"
                  >
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>No preference</option>
                    <option>Gluten-free</option>
                  </select>
                </label>
                <p className="text-xs text-[#8C857B] mt-4">
                  Interests: Culture · Wellness · Quiet Dining
                </p>
              </>
            ) : (
              <div className="mt-5 rounded-xl bg-white p-4 border border-[#E5E0D8]">
                <p className="font-medium text-sm">Visa ending in 2048</p>
                <p className="text-xs text-[#8C857B] mt-1">
                  Primary payment method · Expires 08/28
                </p>
              </div>
            )}
            <button
              onClick={() => setOpenPanel("")}
              className="w-full mt-5 bg-[#1C1C1C] text-white py-3 rounded-xl text-sm font-medium"
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
