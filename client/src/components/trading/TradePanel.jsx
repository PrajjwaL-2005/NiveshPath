import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Wallet2 } from "lucide-react";
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
    return <p className="text-slate-500">Select a stock to trade</p>;
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
    <div className="space-y-5 bg-white rounded-2xl shadow-soft p-5">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-slate-800">
          {symbol} <span className="text-slate-400 font-medium">@</span> ₹{price}
        </p>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          <Wallet2 size={12} />
          ₹{(virtualBalance ?? 0).toLocaleString()}
        </span>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity</label>
        <input
          type="number"
          min="1"
          className="border border-slate-200 p-2.5 w-full rounded-xl text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
        />
      </div>

      <p className="text-sm text-slate-500">
        Est. Total:{" "}
        <span className="font-semibold text-slate-800">
          ₹{estimatedTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </p>

      <div className="space-y-1.5">
        <p className="text-xs text-slate-500 font-medium">Quick Buy</p>
        <div className="flex gap-2">
          {QUICK_PERCENTS.map((pct) => (
            <button
              key={`buy-${pct}`}
              onClick={() => setBuyPercent(pct)}
              className="flex-1 px-2 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              {pct === 1 ? "Max" : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-slate-500 font-medium">Quick Sell</p>
        <div className="flex gap-2">
          {QUICK_PERCENTS.map((pct) => (
            <button
              key={`sell-${pct}`}
              onClick={() => setSellPercent(pct)}
              disabled={holdingQty === 0}
              className="flex-1 px-2 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {pct === 1 ? "Max" : `${pct * 100}%`}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-rose-600 text-sm bg-rose-50 border border-rose-100 rounded-lg py-2 px-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleBuy}
          disabled={tradeLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2.5 rounded-xl shadow-soft transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ShoppingCart size={15} />
          {tradeLoading ? "Processing..." : "Buy"}
        </button>

        <button
          onClick={handleSell}
          disabled={tradeLoading}
          className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-2.5 rounded-xl shadow-soft transition-all duration-200 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
        >
          {tradeLoading ? "Processing..." : "Sell"}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
