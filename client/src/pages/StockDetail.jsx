import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { getStockDetails } from "../services/stockService";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";
import { useAuth } from "../hooks/useAuth";
import DetailSkeleton from "../components/common/skeletons/DetailSkeleton";
import PriceChart from "../components/stocks/PriceChart";
import StockChat from "../components/ai/StockChat";
import TradePanel from "../components/trading/TradePanel";

const StockDetail = () => {
  const { symbol } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getStockDetails(symbol);
        setData(res);
      } catch (err) {
        console.error("Failed to load stock details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();

    if (user) {
      const fetchWatchlistStatus = async () => {
        try {
          const res = await getWatchlist();
          const upperSymbol = symbol.toUpperCase();
          setIsWatchlisted(res.data.some((item) => item.symbol === upperSymbol));
        } catch (err) {
          // ignore — leave unwatchlisted
        }
      };

      fetchWatchlistStatus();
    }
  }, [symbol, user]);

  const toggleWatchlist = async () => {
    try {
      if (isWatchlisted) {
        await removeFromWatchlist(symbol);
        setIsWatchlisted(false);
        toast.success(`Removed ${symbol} from watchlist`);
      } else {
        await addToWatchlist(symbol);
        setIsWatchlisted(true);
        toast.success(`Added ${symbol} to watchlist`);
      }
    } catch (err) {
      toast.error("Failed to update watchlist");
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!data) return <p className="p-6 text-slate-500">No data available</p>;

  const { profile = {}, price = {}, metrics = {} } = data;

  const change = price?.c != null && price?.pc != null ? price.c - price.pc : null;
  const changePercent = change != null && price?.pc ? ((change / price.pc) * 100).toFixed(2) : null;
  const isPositive = change != null && change >= 0;

  // Only send a small, curated summary to the AI — the raw Finnhub payloads
  // (profile + full metrics dump) are far too large for a single chat turn.
  const aiStockData = {
    name: profile?.name,
    ticker: profile?.ticker,
    exchange: profile?.exchange,
    industry: profile?.finnhubIndustry,
    marketCapitalization: profile?.marketCapitalization,
    currentPrice: price?.c,
    open: price?.o,
    high: price?.h,
    low: price?.l,
    previousClose: price?.pc,
    peRatio: metrics?.peBasicExclExtraTTM,
    epsTTM: metrics?.epsInclExtraItemsTTM,
    week52High: metrics?.["52WeekHigh"],
    week52Low: metrics?.["52WeekLow"],
    dividendYield: metrics?.dividendYieldIndicatedAnnual,
    beta: metrics?.beta,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* LEFT SECTION */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">
              {profile?.name ?? symbol} <span className="text-slate-400 font-semibold">({profile?.ticker ?? symbol})</span>
            </h1>

            {user && (
              <button
                onClick={toggleWatchlist}
                className="text-slate-300 hover:text-amber-500 transition-colors"
                aria-label="Toggle watchlist"
              >
                <Star
                  size={22}
                  fill={isWatchlisted ? "#f59e0b" : "none"}
                  className={isWatchlisted ? "text-amber-500" : ""}
                />
              </button>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">{profile?.exchange ?? "—"}</p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-slate-800">₹ {price?.c ?? "N/A"}</p>
            {changePercent != null && (
              <span className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? "+" : ""}
                {change.toFixed(2)} ({changePercent}%)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Open: {price?.o ?? "N/A"} · High: {price?.h ?? "N/A"} · Low: {price?.l ?? "N/A"}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <MetricTile label="Market Cap" value={profile?.marketCapitalization ?? "N/A"} />
            <MetricTile label="P/E" value={metrics?.peBasicExclExtraTTM ?? "N/A"} />
            <MetricTile label="52W High" value={metrics?.["52WeekHigh"] ?? "N/A"} />
            <MetricTile label="52W Low" value={metrics?.["52WeekLow"] ?? "N/A"} />
          </div>

          {/* Description */}
          <p className="mt-6 text-slate-600 text-sm leading-relaxed">
            {profile?.description ?? "No description available."}
          </p>
        </div>

        {/* Chart */}
        <PriceChart symbol={symbol} />

        {/* 🤖 AI STOCK CHAT */}
        <StockChat symbol={symbol} stockData={aiStockData} />
      </div>

      {/* RIGHT SECTION — BUY / SELL */}
      <div className="h-fit lg:sticky lg:top-20">
        <TradePanel symbol={symbol} price={price?.c ?? 0} />
      </div>
    </div>
  );
};

const MetricTile = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl px-3 py-2.5">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
  </div>
);

export default StockDetail;
