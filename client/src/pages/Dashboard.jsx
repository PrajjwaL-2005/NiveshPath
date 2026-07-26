import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { getMe } from "../services/userService";
import { getPortfolio, getTrades } from "../services/portfolioService";
import { getStockQuote } from "../services/stockService";
import OutlineButton from "../components/ui/OutlineButton";

const Dashboard = () => {
  const { virtualBalance, setVirtualBalance } = useAuth();

  const [investedAmount, setInvestedAmount] = useState(0);
  const [activeStocks, setActiveStocks] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Load visibility preference
  useEffect(() => {
    const saved = localStorage.getItem("balanceVisible");
    if (saved !== null) setIsVisible(saved === "true");
  }, []);

  // ✅ Save preference
  useEffect(() => {
    localStorage.setItem("balanceVisible", isVisible);
  }, [isVisible]);

  // ✅ Mask helper
  const maskValue = (value) => {
    return isVisible ? value : "₹ ••••••";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getMe();
        setVirtualBalance(res.data.virtualBalance);

        const portfolioRes = await getPortfolio();
        const holdings = portfolioRes.data.holdings;

        const totalInvested = holdings.reduce(
          (sum, stock) => sum + stock.quantity * stock.avgBuyPrice,
          0
        );

        setInvestedAmount(totalInvested);
        setActiveStocks(holdings.length);

        // ✅ Unrealized P&L from live quotes
        if (holdings.length > 0) {
          const quotes = await Promise.all(
            holdings.map((h) => getStockQuote(h.symbol).catch(() => null))
          );

          const pnl = holdings.reduce((sum, holding, i) => {
            const currentPrice = quotes[i]?.c;
            if (!currentPrice) return sum;
            return sum + (currentPrice - holding.avgBuyPrice) * holding.quantity;
          }, 0);

          setTotalPnL(pnl);
        } else {
          setTotalPnL(0);
        }

        // ✅ Recent trade activity
        const tradesRes = await getTrades();
        setRecentActivity(tradesRes.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  const pnlLabel = `${totalPnL >= 0 ? "+" : "-"}₹${Math.abs(
    totalPnL
  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your portfolio and market activity
          </p>
        </div>

        {/* Toggle Button */}
        <OutlineButton
  onClick={() => setIsVisible((prev) => !prev)}
  className="px-4 py-2 text-sm flex items-center gap-2"
>
  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
  {isVisible ? "Hide Balance" : "Show Balance"}
</OutlineButton>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Wallet Balance"
          value={
            virtualBalance === null
              ? "Loading..."
              : maskValue(`₹${virtualBalance.toLocaleString()}`)
          }
          color="text-green-600"
        />

        <StatCard
          title="Invested Amount"
          value={maskValue(`₹${investedAmount.toLocaleString()}`)}
        />

        <StatCard
          title="Total P&L"
          value={maskValue(pnlLabel)}
          color={totalPnL >= 0 ? "text-green-600" : "text-red-600"}
        />

        <StatCard
          title="Active Stocks"
          value={activeStocks} // not masked (non-sensitive)
        />

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Stocks
          </h3>

          <div className="border rounded-lg p-4 text-gray-500 text-sm">
            Stock list, price changes, charts, and P&L will appear here.
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>

          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-600">
              {recentActivity.map((trade) => (
                <li key={trade._id}>
                  • {trade.type === "BUY" ? "Bought" : "Sold"} {trade.symbol}{" "}
                  ({trade.quantity} shares)
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

/* Reusable Stat Card */
const StatCard = ({ title, value, color = "text-gray-800" }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
};

export default Dashboard;
