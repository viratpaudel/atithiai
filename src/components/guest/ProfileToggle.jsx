export default function ProfileToggle({ icon: Icon, label, checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9F8F6]"
    >
      <span className="flex items-center gap-3">
        <Icon size={18} className="text-[#8C857B]" />
        <span className="text-sm font-medium">{label}</span>
      </span>
      <span
        className={`w-10 h-6 rounded-full relative transition-colors ${checked ? "bg-[#1C1C1C]" : "bg-[#D8D3CB]"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? "right-1" : "left-1"}`}
        />
      </span>
    </button>
  );
}
