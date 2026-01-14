import { fetchStockPrice } from "../utils/apiClient.js";
import { searchStocksFromAPI } from "../utils/stockSearch.js";

export const searchStocks = async (req, res) => {
  const query = req.query.q;

  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const stocks = await searchStocksFromAPI(query);
    res.json(stocks.slice(0, 8)); // limit results
  } catch (err) {
    res.status(500).json([]);
  }  
};


export const searchStock = async (req, res) => {
  const { symbol } = req.params;
  const data = await fetchStockPrice(symbol);
  res.json(data);
};
