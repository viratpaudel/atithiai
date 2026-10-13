export default function NavIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[64px]"
    >
      <Icon
        size={22}
        className={active ? "text-[#1C1C1C]" : "text-[#A39C93]"}
      />
      <span
        className={`text-[10px] font-medium ${active ? "text-[#1C1C1C]" : "text-[#A39C93]"}`}
      >
        {label}
      </span>
    </button>
  );
}
