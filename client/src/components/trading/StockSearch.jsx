import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { searchStocks } from "../../services/stockService";

const RECENT_SEARCHES_KEY = "recentStockSearches";
const MAX_RECENT = 5;

const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (symbol) => {
  const existing = getRecentSearches().filter((s) => s !== symbol);
  const updated = [symbol, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
};

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());

  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setActiveIndex(-1);
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
        setActiveIndex(-1);
      } catch (e) {
        console.error("Search failed", e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const goToSymbol = (symbol) => {
    if (!symbol) return;

    setRecentSearches(saveRecentSearch(symbol));
    setQuery("");
    setResults([]);
    setActiveIndex(-1);

    // ✅ Navigate to stock detail page
    navigate(`/stocks/${symbol}`);
  };

  const handleSelect = (stock) => {
    goToSymbol(stock.symbol);
    if (onSelect) onSelect(stock);
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[activeIndex] ?? results[0];
      if (selected) handleSelect(selected);
    }
  };

  const showRecent =
    isFocused && query.length === 0 && results.length === 0 && recentSearches.length > 0;

  return (
    <div className="relative max-w-md">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="border border-slate-200 bg-white pl-10 pr-9 py-2.5 w-full rounded-xl text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          placeholder="Search stock (INFY, Reliance...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
        {loading && (
          <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-500 animate-spin" />
        )}
      </div>

      {showRecent && (
        <div className="absolute z-10 bg-white border border-slate-200 w-full rounded-xl shadow-card mt-2 p-3 animate-fade-in">
          <p className="text-xs text-slate-400 mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((symbol) => (
              <button
                key={symbol}
                onMouseDown={() => goToSymbol(symbol)}
                className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-full transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-slate-200 w-full rounded-xl shadow-card mt-2 max-h-64 overflow-y-auto animate-fade-in">
          {results.map((stock, idx) => (
            <li
              key={stock.symbol ?? idx}
              className={`p-3 cursor-pointer first:rounded-t-xl last:rounded-b-xl transition-colors ${
                idx === activeIndex ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
              onClick={() => handleSelect(stock)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div className="font-medium text-slate-800">
                {stock.symbol ?? "N/A"}
              </div>
              <div className="text-xs text-slate-500">
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
