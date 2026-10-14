import IconBadge from "../ui/IconBadge";

export default function SidebarItem({ icon: Icon, label, active, count, alert, tone = "teal" }) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
    >
      <div className="flex items-center gap-3">
        <IconBadge icon={Icon} tone={alert ? "coral" : tone} size="sm" pulse={alert} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count && (
        <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
      {alert && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      )}
    </button>
  );
}
