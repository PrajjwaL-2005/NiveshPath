import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { buyStock, sellStock } from "../../services/tradeService";
import { getPortfolio } from "../../services/portfolioService";
import { useAuth } from "../../hooks/useAuth";

const QUICK_PERCENTS = [0.25, 0.5, 0.75, 1];

const TradePanel = ({ symbol, price }) => {
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [holdingQty, setHoldingQty] = useState(0);
  const { virtualBalance, setVirtualBalance } = useAuth();

  useEffect(() => {
    if (!symbol) return;

    const fetchHolding = async () => {
      try {
        const res = await getPortfolio();
        const holding = res.data.holdings.find(
          (h) => h.symbol === symbol.toUpperCase()
        );
        setHoldingQty(holding?.quantity ?? 0);
      } catch (err) {
        setHoldingQty(0);
      }
    };

    fetchHolding();
  }, [symbol]);

  if (!symbol) {
    return <p className="text-gray-500">Select a stock to trade</p>;
  }

  const maxBuyQty = price > 0 ? Math.floor((virtualBalance ?? 0) / price) : 0;
  const estimatedTotal = quantity * price;

  const setBuyPercent = (pct) => {
    setQuantity(Math.max(1, Math.floor(maxBuyQty * pct)));
  };

  const setSellPercent = (pct) => {
    setQuantity(Math.max(1, Math.floor(holdingQty * pct)));
  };

  const handleBuy = async () => {
    try {
      setTradeLoading(true);
      setError(null);
      const res = await buyStock(symbol, quantity);
      setVirtualBalance(res.data.virtualBalance);
      toast.success("Buy successful");
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
      const res = await sellStock(symbol, quantity);
      setVirtualBalance(res.data.virtualBalance);
      toast.success("Sell successful");
    } catch (err) {
      setError(err.response?.data?.message || "Sell failed");
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">
        {symbol} @ ₹{price}
      </p>

      <input
        type="number"
        min="1"
        className="border p-2 w-32"
        value={quantity}
        onChange={(e) => setQuantity(+e.target.value)}
      />

      <p className="text-sm text-gray-600">
        Est. Total: ₹
        {estimatedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-medium">Quick Buy</p>
        <div className="flex gap-2">
          {QUICK_PERCENTS.map((pct) => (
            <button
              key={`buy-${pct}`}
              onClick={() => setBuyPercent(pct)}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100 transition"
            >
              {pct === 1 ? "Max" : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-medium">Quick Sell</p>
        <div className="flex gap-2">
          {QUICK_PERCENTS.map((pct) => (
            <button
              key={`sell-${pct}`}
              onClick={() => setSellPercent(pct)}
              disabled={holdingQty === 0}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pct === 1 ? "Max" : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleBuy}
          disabled={tradeLoading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          {tradeLoading ? "Processing..." : "Buy"}
        </button>

        <button
          onClick={handleSell}
          disabled={tradeLoading}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          {tradeLoading ? "Processing..." : "Sell"}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
