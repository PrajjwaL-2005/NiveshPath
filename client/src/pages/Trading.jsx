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
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Trading</h2>

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
      {!symbol && (
        <p className="text-gray-500">
          Search and select a stock to start trading
        </p>
      )}
    </div>
  );
};

export default Trading;
  