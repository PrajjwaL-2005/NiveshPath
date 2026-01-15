import {
  searchStocksFromFinnhub,
  fetchStockPriceFromFinnhub,
} from "../utils/finnhubClient.js";
import {
  fetchFullStockDetailsFromFinnhub,
} from "../utils/finnhubClient.js";

export const searchStocks = async (req, res) => {
  const query = req.query.q;
  console.log("QUERY RECEIVED:", query);

  if (!query || query.length < 2) {
    console.log("❌ Query validation failed");
    return res.json([]);
  }

  try {
    const stocks = await searchStocksFromFinnhub(query);
    console.log("✅ Finnhub returned:", stocks?.length);
    res.json(stocks.slice(0, 8));
  } catch (error) {
    console.error(
      "🔥 Finnhub ERROR:",
      error.response?.data || error.message
    );
    res.status(500).json([]);
  }
};


export const searchStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await fetchStockPriceFromFinnhub(symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock price" });
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stockDetails = await fetchFullStockDetailsFromFinnhub(symbol);

    res.json(stockDetails);
  } catch (error) {
    console.error(
      "Stock details error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to fetch stock details",
    });
  }
};
