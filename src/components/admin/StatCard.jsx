export default function StatCard({ title, value, trend, alert }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border ${alert ? "border-red-200" : "border-[#E5E0D8]"}`}
    >
      <h3 className="text-sm font-medium text-[#8C857B] mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <span
          className={`text-3xl font-serif ${alert ? "text-red-600" : "text-[#1C1C1C]"}`}
        >
          {value}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md ${alert ? "bg-red-50 text-red-600" : "bg-[#F0ECE4] text-[#6B655C]"}`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
