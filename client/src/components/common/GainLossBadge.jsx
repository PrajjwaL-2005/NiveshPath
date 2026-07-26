import { TrendingUp, TrendingDown } from "lucide-react";

const GainLossBadge = ({ value, formatValue }) => {
  if (value == null) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const isPositive = value >= 0;
  const label = formatValue ? formatValue(value) : value;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
        isPositive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {label}
    </span>
  );
};

export default GainLossBadge;
