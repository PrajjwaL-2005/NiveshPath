import { useNavigate } from "react-router-dom";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();

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
      <div>
        <h4 className="font-semibold text-gray-800">
          {stock.symbol}
        </h4>
        <p className="text-xs text-gray-500">
          {stock.name || "—"}
        </p>
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
