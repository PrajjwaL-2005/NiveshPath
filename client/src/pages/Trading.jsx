import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockSearch from "../components/trading/StockSearch";
import TradePanel from "../components/trading/TradePanel";
import { getStockDetails } from "../services/stockService";
import Loader from "../components/common/Loader";

const Trading = () => {
  const { symbol } = useParams(); // optional at first
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) {
      setStock(null);
      return;
    }

    const fetchStock = async () => {
      try {
        setLoading(true);
        const data = await getStockDetails(symbol);
        setStock(data);
      } catch (err) {
        console.error("Failed to fetch stock details", err);
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Trading</h2>
        <p className="text-slate-500 text-sm mt-1">Search a stock and place a trade</p>
      </div>

      {/* 🔍 Search Bar */}
      <StockSearch />

      {/* ⏳ Loading */}
      {loading && <Loader />}

      {/* 📊 Trade Panel */}
      {stock && !loading && (
        <TradePanel
          symbol={symbol}
          price={stock.price.c}
        />
      )}

      {/* ℹ️ Empty state */}
      {!symbol && !loading && (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500 bg-white">
          Search and select a stock to start trading
        </div>
      )}
    </div>
  );
};

export default Trading;
  