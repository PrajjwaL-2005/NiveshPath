import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../../services/watchlistService";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkWatchlist = async () => {
      try {
        const res = await getWatchlist();
        setIsWatchlisted(
          res.data.some((item) => item.symbol === stock.symbol.toUpperCase())
        );
      } catch (err) {
        // ignore — leave unwatchlisted
      }
    };

    checkWatchlist();
  }, [stock.symbol, user]);

  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWatchlisted) {
        await removeFromWatchlist(stock.symbol);
        setIsWatchlisted(false);
        toast.success(`Removed ${stock.symbol} from watchlist`);
      } else {
        await addToWatchlist(stock.symbol);
        setIsWatchlisted(true);
        toast.success(`Added ${stock.symbol} to watchlist`);
      }
    } catch (err) {
      toast.error("Failed to update watchlist");
    }
  };

  const price = stock.price ?? 0;
  const open = stock.open ?? price;
  const change = price - open;
  const changePercent = ((change / open) * 100).toFixed(2);

  const isPositive = change >= 0;

  return (
    <div
      onClick={() => navigate(`/stocks/${stock.symbol}`)}
      className="flex justify-between items-center border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={toggleWatchlist}
            className="text-gray-400 hover:text-yellow-500 transition"
            aria-label="Toggle watchlist"
          >
            <Star
              size={18}
              fill={isWatchlisted ? "#eab308" : "none"}
              className={isWatchlisted ? "text-yellow-500" : ""}
            />
          </button>
        )}

        <div>
          <h4 className="font-semibold text-gray-800">
            {stock.symbol}
          </h4>
          <p className="text-xs text-gray-500">
            {stock.name || "—"}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className="font-semibold text-gray-800">
          ₹{price}
        </p>
        <p
          className={`text-xs ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(2)} ({changePercent}%)
        </p>
      </div>
    </div>
  );
};

export default StockCard;
