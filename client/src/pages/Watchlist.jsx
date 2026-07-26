import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { getStockQuote } from "../services/stockService";
import Loader from "../components/common/Loader";

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await getWatchlist();
        const data = res.data;
        setItems(data);

        if (data.length > 0) {
          const entries = await Promise.all(
            data.map(async (item) => {
              const quote = await getStockQuote(item.symbol).catch(() => null);
              return [item.symbol, quote];
            })
          );
          setQuotes(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Failed to fetch watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      setItems((prev) => prev.filter((item) => item.symbol !== symbol));
      toast.success(`Removed ${symbol} from watchlist`);
    } catch (err) {
      toast.error("Failed to remove from watchlist");
    }
  };

  if (loading) return <Loader />;

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">Watchlist</h2>
        <div className="bg-white border rounded-xl shadow p-10 text-center">
          <Star className="mx-auto mb-3 text-gray-300" size={32} />
          <p className="text-gray-600 font-medium mb-1">
            Your watchlist is empty.
          </p>
          <p className="text-sm text-gray-400">
            Star a stock from its detail page to track it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Watchlist</h2>

      <div className="bg-white rounded-xl shadow divide-y">
        {items.map((item) => {
          const quote = quotes[item.symbol];
          const price = quote?.c;
          const change =
            price != null && quote?.pc != null ? price - quote.pc : null;
          const changePercent =
            change != null && quote?.pc ? ((change / quote.pc) * 100).toFixed(2) : null;

          return (
            <div key={item._id} className="flex justify-between items-center p-4">
              <Link
                to={`/stocks/${item.symbol}`}
                className="font-medium text-gray-800 hover:text-blue-600"
              >
                {item.symbol}
              </Link>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-gray-800">
                    {price != null ? `₹${price.toLocaleString()}` : "—"}
                  </p>
                  {changePercent != null && (
                    <p
                      className={`text-xs ${
                        change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)} ({changePercent}%)
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRemove(item.symbol)}
                  className="text-sm text-gray-400 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
