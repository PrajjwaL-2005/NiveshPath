import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getPortfolio } from "../services/portfolioService";
import { getStockQuote } from "../services/stockService";
import TableRowSkeleton from "../components/common/skeletons/TableRowSkeleton";
import GainLossBadge from "../components/common/GainLossBadge";

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#7c3aed",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await getPortfolio();
        const data = res.data.holdings;
        setHoldings(data);

        if (data.length > 0) {
          const entries = await Promise.all(
            data.map(async (holding) => {
              const quote = await getStockQuote(holding.symbol).catch(() => null);
              return [holding.symbol, quote?.c ?? null];
            })
          );
          setQuotes(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-slate-800">Portfolio</h2>

        <div className="bg-white rounded-2xl shadow-soft p-6 animate-pulse">
          <div className="h-5 w-40 bg-slate-200 rounded mb-4"></div>
          <div className="h-72 w-72 mx-auto rounded-full bg-slate-100"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-600">
                <th className="p-3">Symbol</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Avg Buy</th>
                <th className="p-3">Current Price</th>
                <th className="p-3">P&L</th>
              </tr>
            </thead>
            <tbody>
              <TableRowSkeleton columns={5} />
              <TableRowSkeleton columns={5} />
              <TableRowSkeleton columns={5} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Portfolio</h2>
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl shadow-soft p-10 text-center">
          <p className="text-slate-600 font-medium mb-1">
            You don't own any stocks yet.
          </p>
          <p className="text-sm text-slate-400">
            Head over to Trade to buy your first stock.
          </p>
        </div>
      </div>
    );
  }

  const allocationData = holdings.map((holding) => {
    const currentPrice = quotes[holding.symbol] ?? holding.avgBuyPrice;
    return {
      name: holding.symbol,
      value: currentPrice * holding.quantity,
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Portfolio</h2>

      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Asset Allocation</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {allocationData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="p-3">Symbol</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Avg Buy</th>
              <th className="p-3">Current Price</th>
              <th className="p-3">P&L</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((holding) => {
              const currentPrice = quotes[holding.symbol];
              const pnl =
                currentPrice != null
                  ? (currentPrice - holding.avgBuyPrice) * holding.quantity
                  : null;

              return (
                <tr key={holding._id} className="border-t border-slate-100 text-sm hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{holding.symbol}</td>
                  <td className="p-3 text-slate-600">{holding.quantity}</td>
                  <td className="p-3 text-slate-600">₹{holding.avgBuyPrice.toLocaleString()}</td>
                  <td className="p-3 text-slate-600">
                    {currentPrice != null ? `₹${currentPrice.toLocaleString()}` : "—"}
                  </td>
                  <td className="p-3">
                    <GainLossBadge
                      value={pnl}
                      formatValue={(v) =>
                        `${v >= 0 ? "+" : "-"}₹${Math.abs(v).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}`
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
