import { useState } from "react";
import StockSearch from "../components/trading/StockSearch";
import TradePanel from "../components/trading/TradePanel";
import { fetchStockPrice } from "../services/stockService";

const Trading = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [price, setPrice] = useState(null);

  const handleSelectStock = async (stock) => {
    setSelectedStock(stock);
    const res = await fetchStockPrice(stock.symbol);
    setPrice(res.data.price);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Trading</h2>

      <StockSearch onSelect={handleSelectStock} />

      {price && (
        <TradePanel
          symbol={selectedStock.symbol}
          price={price}
        />
      )}
    </div>
  );
};

export default Trading;
