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
import Loader from "../components/common/Loader";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
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

  if (loading) return <Loader />;

  if (holdings.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Portfolio</h2>
        <div className="bg-white border rounded-xl shadow p-10 text-center">
          <p className="text-gray-600 font-medium mb-1">
            You don't own any stocks yet.
          </p>
          <p className="text-sm text-gray-400">
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
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className="text-xl font-bold">Portfolio</h2>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
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

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
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
                <tr key={holding._id} className="border-t text-sm">
                  <td className="p-3 font-medium">{holding.symbol}</td>
                  <td className="p-3">{holding.quantity}</td>
                  <td className="p-3">₹{holding.avgBuyPrice.toLocaleString()}</td>
                  <td className="p-3">
                    {currentPrice != null ? `₹${currentPrice.toLocaleString()}` : "—"}
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      pnl == null
                        ? "text-gray-400"
                        : pnl >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {pnl == null
                      ? "—"
                      : `${pnl >= 0 ? "+" : "-"}₹${Math.abs(pnl).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}`}
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
