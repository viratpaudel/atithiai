import { motion } from "framer-motion";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
  { value: "system", icon: Laptop, label: "Follow system theme" },
];

// Sun / moon / auto segmented toggle with animated thumb.
export default function ThemeToggle({ variant = "light" }) {
  const { theme, setTheme } = useTheme();

  const shell =
    variant === "dark"
      ? "bg-white/10 border-white/20"
      : "bg-surface-2 border-line";

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={`flex items-center gap-0.5 rounded-full border p-1 ${shell}`}
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full"
          >
            {active && (
              <motion.span
                layoutId={`theme-thumb-${variant}`}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="absolute inset-0 rounded-full bg-primary-btn shadow-glow"
              />
            )}
            <motion.span
              animate={{ rotate: active ? 0 : -12, scale: active ? 1 : 0.9 }}
              whileTap={{ scale: 0.85 }}
              className="relative"
            >
              <Icon
                size={15}
                strokeWidth={2.25}
                className={active ? "text-white" : variant === "dark" ? "text-white/60" : "text-muted"}
              />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
