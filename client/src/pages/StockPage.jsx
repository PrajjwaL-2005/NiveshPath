import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchStockPrice } from "../services/stockService";
import PriceChart from "../components/PriceChart";

const StockPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStock = async () => {
      try {
        const res = await fetchStockPrice(symbol);
        setStock(res.data);
      } catch (err) {
        console.error("Failed to load stock");
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [symbol]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!stock) return <p className="p-6">Stock not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{symbol}</h1>
        <p className="text-gray-500">
          Open: ₹{stock.open} | High: ₹{stock.high} | Low: ₹{stock.low}
        </p>
        <p className="text-xl font-bold mt-2">
          ₹{stock.price}
        </p>
      </div>

      <PriceChart />
    </div>
  );
};

export default StockPage;
