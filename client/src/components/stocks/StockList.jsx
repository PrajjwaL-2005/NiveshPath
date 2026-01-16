import StockCard from "./StockCard";

const StockList = ({ stocks }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Search for stocks to see results
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
};

export default StockList;
