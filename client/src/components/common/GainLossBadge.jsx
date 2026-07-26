import { TrendingUp, TrendingDown } from "lucide-react";

const GainLossBadge = ({ value, formatValue }) => {
  if (value == null) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const isPositive = value >= 0;
  const label = formatValue ? formatValue(value) : value;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {label}
    </span>
  );
};

export default GainLossBadge;
