import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, Wallet, Landmark, Activity, LineChart } from "lucide-react";
import { getMe } from "../services/userService";
import { getPortfolio, getTrades } from "../services/portfolioService";
import { getStockQuote } from "../services/stockService";
import OutlineButton from "../components/ui/OutlineButton";
import CardSkeleton from "../components/common/skeletons/CardSkeleton";
import GainLossBadge from "../components/common/GainLossBadge";

const Dashboard = () => {
  const { virtualBalance, setVirtualBalance } = useAuth();

  const [investedAmount, setInvestedAmount] = useState(0);
  const [holdingsData, setHoldingsData] = useState([]);
  const [totalPnL, setTotalPnL] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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

        // ✅ Live quotes per holding — feeds both the stock list and Total P&L
        if (holdings.length > 0) {
          const quotes = await Promise.all(
            holdings.map((h) => getStockQuote(h.symbol).catch(() => null))
          );

          const enriched = holdings.map((holding, i) => {
            const currentPrice = quotes[i]?.c ?? null;
            const pnl =
              currentPrice != null
                ? (currentPrice - holding.avgBuyPrice) * holding.quantity
                : null;
            return { ...holding, currentPrice, pnl };
          });

          setHoldingsData(enriched);
          setTotalPnL(
            enriched.reduce((sum, h) => sum + (h.pnl ?? 0), 0)
          );
        } else {
          setHoldingsData([]);
          setTotalPnL(0);
        }

        // ✅ Recent trade activity
        const tradesRes = await getTrades({ limit: 5 });
        setRecentActivity(tradesRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pnlLabel = `${totalPnL >= 0 ? "+" : "-"}₹${Math.abs(
    totalPnL
  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            icon={<Wallet size={18} />}
            iconColor="from-brand-500 to-brand-600"
            title="Wallet Balance"
            value={
              virtualBalance === null
                ? "Loading..."
                : maskValue(`₹${virtualBalance.toLocaleString()}`)
            }
          />

          <StatCard
            icon={<Landmark size={18} />}
            iconColor="from-violet-500 to-violet-600"
            title="Invested Amount"
            value={maskValue(`₹${investedAmount.toLocaleString()}`)}
          />

          <StatCard
            icon={<LineChart size={18} />}
            iconColor={totalPnL >= 0 ? "from-emerald-500 to-emerald-600" : "from-rose-500 to-rose-600"}
            title="Total P&L"
            badge={
              isVisible ? (
                <GainLossBadge value={totalPnL} formatValue={() => pnlLabel} />
              ) : (
                <span className="text-2xl font-bold mt-2 block text-slate-800">
                  ₹ ••••••
                </span>
              )
            }
          />

          <StatCard
            icon={<Activity size={18} />}
            iconColor="from-amber-500 to-amber-600"
            title="Active Stocks"
            value={holdingsData.length} // not masked (non-sensitive)
          />

        </div>
      )}

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Your Stocks
          </h3>

          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : holdingsData.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
              No holdings yet. Buy your first stock to see it here.
            </div>
          ) : (
            <div className="space-y-1">
              {holdingsData.map((holding) => (
                <div
                  key={holding._id}
                  className="flex justify-between items-center rounded-xl px-3 py-3 -mx-3 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{holding.symbol}</p>
                    <p className="text-xs text-slate-500">
                      {holding.quantity} shares @ ₹{holding.avgBuyPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-slate-800 font-medium">
                      {holding.currentPrice != null
                        ? `₹${holding.currentPrice.toLocaleString()}`
                        : "—"}
                    </p>
                    <GainLossBadge
                      value={holding.pnl}
                      formatValue={(v) =>
                        `${v >= 0 ? "+" : "-"}₹${Math.abs(v).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}`
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Activity
          </h3>

          {loading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity yet.</p>
          ) : (
            <ul className="space-y-1">
              {recentActivity.map((trade) => (
                <li
                  key={trade._id}
                  className="flex items-center gap-2 text-sm text-slate-600 rounded-lg px-2 py-2 -mx-2 hover:bg-slate-50 transition-colors"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      trade.type === "BUY" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className={trade.type === "BUY" ? "text-emerald-700 font-medium" : "text-rose-700 font-medium"}>
                    {trade.type === "BUY" ? "Bought" : "Sold"}
                  </span>
                  {trade.symbol} ({trade.quantity} shares)
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
const StatCard = ({ icon, iconColor, title, value, badge }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        {icon && (
          <span className={`flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br ${iconColor} text-white`}>
            {icon}
          </span>
        )}
      </div>
      {badge ? (
        <div className="mt-2">{badge}</div>
      ) : (
        <h2 className="text-2xl font-bold mt-2 text-slate-800">
          {value}
        </h2>
      )}
    </div>
  );
};

export default Dashboard;
