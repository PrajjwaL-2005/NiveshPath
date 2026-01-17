import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStockDetails } from "../services/stockService";
import { buyStock, sellStock } from "../services/tradeService";
import Loader from "../components/common/Loader";
import PriceChart from "../components/stocks/PriceChart";
import StockChat from "../components/ai/StockChat";

const StockDetail = () => {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [symbol]);

  const handleBuy = async () => {
    try {
      setTradeLoading(true);
      setError(null);
      await buyStock(symbol, quantity);
      alert("Buy order executed");
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
      alert("Sell order executed");
    } catch (err) {
      setError(err.response?.data?.message || "Sell failed");
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!data) return <p>No data available</p>;

  const { profile, price, metrics } = data;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SECTION */}
      <div className="lg:col-span-2">
        {/* Header */}
        <h1 className="text-2xl font-bold">
          {profile.name} ({profile.ticker})
        </h1>
        <p className="text-gray-500">{profile.exchange}</p>

        {/* Price */}
        <div className="mt-4">
          <p className="text-xl font-semibold">₹ {price.c}</p>
          <p className="text-sm text-gray-500">
            Open: {price.o} | High: {price.h} | Low: {price.l}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>Market Cap: {profile.marketCapitalization}</div>
          <div>P/E: {metrics.peBasicExclExtraTTM}</div>
          <div>52W High: {metrics["52WeekHigh"]}</div>
          <div>52W Low: {metrics["52WeekLow"]}</div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <PriceChart symbol={symbol} />
        </div>

        {/* Description */}
        <p className="mt-6 text-gray-700">
          {profile.description}
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
          {profile.ticker} @ ₹{price.c}
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
