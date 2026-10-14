import { motion } from "framer-motion";

export default function NavIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 min-w-[48px] py-1.5"
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-x-0 -inset-y-0.5 rounded-full bg-primary-btn shadow-glow"
        />
      )}
      <motion.span
        animate={
          active
            ? { scale: [1.15, 1.28, 1.15], y: [0, -3, 0] }
            : { scale: 1, y: 0 }
        }
        transition={
          active
            ? { duration: 0.9, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }
            : { type: "spring", stiffness: 400, damping: 22 }
        }
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center"
      >
        <Icon
          size={20}
          strokeWidth={2.25}
          className={active ? "text-white" : "text-brand-700 dark:text-brand-300/80"}
        />
      </motion.span>
      <span
        className={`relative text-[9px] font-semibold tracking-wide ${
          active ? "text-white" : "text-brand-700 dark:text-brand-300/80"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
