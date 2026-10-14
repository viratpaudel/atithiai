import { CloudRain, Sparkles } from "lucide-react";
import IconBadge from "../ui/IconBadge";

// Deterministic decorative sparkline heights (pure CSS, no chart library).
const SPARK_HEIGHTS = [40, 65, 50, 85, 60, 95, 72, 55, 80, 45, 70, 90];

export default function StatCard({ title, value, trend, alert }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-card border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lift ${alert ? "border-red-200" : "border-line"}`}
    >
      <div className="accent-strip" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-muted mb-2">{title}</h3>
          <span
            className={`text-3xl font-serif ${alert ? "text-coral-600" : "text-ink"}`}
          >
            {value}
          </span>
          <span
            className={`mt-2 block text-xs font-medium px-2 py-1 rounded-md w-fit ${alert ? "bg-red-50 dark:bg-red-500/15 text-coral-600 dark:text-coral-400" : "bg-brand-50 text-muted"}`}
          >
            {trend}
          </span>
        </div>
        <div className="flex flex-col items-end gap-3">
          <IconBadge
            icon={alert ? CloudRain : Sparkles}
            tone={alert ? "coral" : "teal"}
            size="md"
            pulse={alert}
          />
          <span className="sparkline" aria-hidden="true">
            {SPARK_HEIGHTS.map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
