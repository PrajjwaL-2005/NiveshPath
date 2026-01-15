import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchStocks } from "../../services/stockService";

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchStocks(query);

        let list = [];
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (Array.isArray(res.data?.results)) {
          list = res.data.results;
        }

        setResults(list);
      } catch (e) {
        console.error("Search failed", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (stock) => {
    const symbol = stock.symbol;
    if (!symbol) return;

    setQuery(symbol);
    setResults([]);

    // ✅ Navigate to stock detail page
    navigate(`/stocks/${symbol}`);

    // Optional: keep callback if parent needs it
    if (onSelect) onSelect(stock);
  };

  return (
    <div className="relative max-w-md">
      <input
        className="border p-2 w-full rounded"
        placeholder="Search stock (INFY, Reliance...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="absolute bg-white p-2 text-sm">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-64 overflow-y-auto">
          {results.map((stock, idx) => (
            <li
              key={stock.symbol ?? idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(stock)}
            >
              <div className="font-medium">
                {stock.symbol ?? "N/A"}
              </div>
              <div className="text-xs text-gray-500">
                {stock.description ?? stock.name ?? ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockSearch;
