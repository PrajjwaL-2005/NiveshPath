import { useState } from "react";
import { buyStock, sellStock } from "../../services/tradeService";
import { useAuth } from "../../hooks/useAuth";

const TradePanel = ({ symbol, price }) => {
  const [quantity, setQuantity] = useState(1);
  const { setVirtualBalance } = useAuth();

  if (!symbol) {
    return <p className="text-gray-500">Select a stock to trade</p>;
  }

  const handleBuy = async () => {
    const res = await buyStock(symbol, quantity);
    setVirtualBalance(res.data.virtualBalance);
    alert("Buy successful");
  };

  const handleSell = async () => {
    const res = await sellStock(symbol, quantity);
    setVirtualBalance(res.data.virtualBalance);
    alert("Sell successful");
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

      <div className="flex gap-3">
        <button
          onClick={handleBuy}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Buy
        </button>

        <button
          onClick={handleSell}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
