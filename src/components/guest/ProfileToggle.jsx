import IconBadge from "../ui/IconBadge";

export default function ProfileToggle({ icon: Icon, label, checked, onChange, tone = "teal" }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-50"
    >
      <span className="flex items-center gap-3">
        <IconBadge icon={Icon} tone={checked ? tone : "teal"} size="sm" />
        <span className="text-sm font-medium">{label}</span>
      </span>
      <span
        className={`w-10 h-6 rounded-full relative transition-colors ${checked ? "bg-brand-900" : "bg-line"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? "right-1" : "left-1"}`}
        />
      </span>
    </button>
  );
}
