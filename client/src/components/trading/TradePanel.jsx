import { useState } from "react";
import toast from "react-hot-toast";
import { buyStock, sellStock } from "../../services/tradeService";
import { useAuth } from "../../hooks/useAuth";

const TradePanel = ({ symbol, price }) => {
  const [quantity, setQuantity] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setVirtualBalance } = useAuth();

  if (!symbol) {
    return <p className="text-gray-500">Select a stock to trade</p>;
  }

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

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleBuy}
          disabled={tradeLoading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {tradeLoading ? "Processing..." : "Buy"}
        </button>

        <button
          onClick={handleSell}
          disabled={tradeLoading}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {tradeLoading ? "Processing..." : "Sell"}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
