import { useState } from "react";
import api from "../services/api";

const Trading = () => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);

  const fetchPrice = async () => {
    const res = await api.get(`/stocks/${symbol}`);
    setPrice(res.data.price);
  };

  const buyStock = async () => {
    await api.post("/trade/buy", { symbol, quantity });
    alert("Buy successful");
  };

  const sellStock = async () => {
    await api.post("/trade/sell", { symbol, quantity });
    alert("Sell successful");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Trading</h2>

      <div className="flex gap-2">
        <input
          placeholder="Stock Symbol (AAPL)"
          className="border p-2"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <button
          onClick={fetchPrice}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {price && (
        <p className="text-lg">Current Price: ₹{price}</p>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          className="border p-2 w-32"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={buyStock}
          className="bg-green-600 text-white px-4 rounded"
        >
          Buy
        </button>

        <button
          onClick={sellStock}
          className="bg-red-600 text-white px-4 rounded"
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default Trading;
