import { useEffect, useState } from "react";
import { getTrendingStocks } from "../../services/stockService";

const TrendingStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getTrendingStocks();
        setStocks(data);
      } catch (err) {
        setError("Failed to load trending stocks");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  if (loading) return <p>Loading trending stocks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">🔥 Trending Stocks</h2>

      <ul className="space-y-3">
        {stocks.map((stock) => (
          <li
            key={stock.symbol}
            className="flex justify-between items-center border-b pb-2"
          >
            <span className="font-medium">{stock.symbol}</span>

            <div className="text-right">
              <p className="font-semibold">${stock.price.toFixed(2)}</p>
              <p
                className={
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {stock.percentChange.toFixed(2)}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingStocks;
