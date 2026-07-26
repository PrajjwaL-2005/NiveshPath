import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { getStockDetails } from "../services/stockService";
import { buyStock, sellStock } from "../services/tradeService";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import PriceChart from "../components/stocks/PriceChart";
import StockChat from "../components/ai/StockChat";

const StockDetail = () => {
  const { symbol } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // 🔹 Trade state
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleBuy = async () => {
    try {
      setTradeLoading(true);
      setError(null);
      await buyStock(symbol, quantity);
      toast.success("Buy order executed");
    } catch (err) {
      setError(err.response?.data?.message || "Buy failed");
    } finally {
      setTradeLoading(false);
    }
  };

  const handleSell = async () => {
    try {
      setTradeLoading(true);
      setError(null);
      await sellStock(symbol, quantity);
      toast.success("Sell order executed");
    } catch (err) {
      setError(err.response?.data?.message || "Sell failed");
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!data) return <p>No data available</p>;

  const { profile = {}, price = {}, metrics = {} } = data;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SECTION */}
      <div className="lg:col-span-2">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {profile?.name ?? symbol} ({profile?.ticker ?? symbol})
          </h1>

          {user && (
            <button
              onClick={toggleWatchlist}
              className="text-gray-400 hover:text-yellow-500 transition"
              aria-label="Toggle watchlist"
            >
              <Star
                size={22}
                fill={isWatchlisted ? "#eab308" : "none"}
                className={isWatchlisted ? "text-yellow-500" : ""}
              />
            </button>
          )}
        </div>
        <p className="text-gray-500">{profile?.exchange ?? "—"}</p>

        {/* Price */}
        <div className="mt-4">
          <p className="text-xl font-semibold">₹ {price?.c ?? "N/A"}</p>
          <p className="text-sm text-gray-500">
            Open: {price?.o ?? "N/A"} | High: {price?.h ?? "N/A"} | Low: {price?.l ?? "N/A"}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>Market Cap: {profile?.marketCapitalization ?? "N/A"}</div>
          <div>P/E: {metrics?.peBasicExclExtraTTM ?? "N/A"}</div>
          <div>52W High: {metrics?.["52WeekHigh"] ?? "N/A"}</div>
          <div>52W Low: {metrics?.["52WeekLow"] ?? "N/A"}</div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <PriceChart symbol={symbol} />
        </div>

        {/* Description */}
        <p className="mt-6 text-gray-700">
          {profile?.description ?? "No description available."}
        </p>
        {/* 🤖 AI STOCK CHAT */}
        <StockChat
          symbol={symbol}
          stockData={{
            profile,
            price,
            metrics,
          }}
        />
      </div>

      {/* RIGHT SECTION — BUY / SELL */}
      <div className="border rounded-lg p-4 h-fit">
        <h2 className="text-lg font-semibold mb-4">Trade</h2>

        <p className="mb-2">
          {profile?.ticker ?? symbol} @ ₹{price?.c ?? "N/A"}
        </p>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        />

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleBuy}
            disabled={tradeLoading}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Buy
          </button>

          <button
            onClick={handleSell}
            disabled={tradeLoading}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
