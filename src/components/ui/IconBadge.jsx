import { motion } from "framer-motion";

// Tone -> gradient + glow shadow pairs (kept in sync with tailwind.config.js).
const TONES = {
  saffron: {
    tile: "bg-gradient-to-br from-saffron-400 to-coral-500 shadow-[0_6px_18px_rgba(245,158,11,0.45)]",
  },
  teal: {
    tile: "bg-gradient-to-br from-brand-400 to-brand-700 shadow-[0_6px_18px_rgba(18,135,126,0.45)]",
  },
  coral: {
    tile: "bg-gradient-to-br from-coral-400 to-coral-600 shadow-[0_6px_18px_rgba(244,98,83,0.45)]",
  },
  violet: {
    tile: "bg-gradient-to-br from-violet-400 to-violet-600 shadow-[0_6px_18px_rgba(139,92,246,0.45)]",
  },
  emerald: {
    tile: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_6px_18px_rgba(16,185,129,0.45)]",
  },
  sky: {
    tile: "bg-gradient-to-br from-sky-400 to-sky-600 shadow-[0_6px_18px_rgba(14,165,233,0.45)]",
  },
};

const SIZES = {
  sm: { box: "h-8 w-8", icon: 16 },
  md: { box: "h-10 w-10", icon: 20 },
  lg: { box: "h-12 w-12", icon: 24 },
};

// Sizing guide: icons render at 20 / 24 / 28 px depending on context.
const ICON_SIZE_OVERRIDE = { lg: 28 };

/**
 * IconBadge — wraps a lucide icon in a rounded gradient tile with a soft
 * colored glow. Icon is always white with heavier stroke for contrast.
 */
export default function IconBadge({
  icon: Icon,
  tone = "teal",
  size = "md",
  className = "",
  pulse = false,
}) {
  const toneStyle = TONES[tone] ?? TONES.teal;
  const sizeStyle = SIZES[size] ?? SIZES.md;
  const iconSize = ICON_SIZE_OVERRIDE[size] ?? sizeStyle.icon;

  return (
    <motion.span
      whileTap={{ scale: 0.9 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${sizeStyle.box} ${toneStyle.tile} text-white ${pulse ? "animate-pulse" : ""} ${className}`}
    >
      <Icon size={iconSize} strokeWidth={2.25} />
    </motion.span>
  );
}
