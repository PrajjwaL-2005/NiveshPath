import {
  searchStocksFromFinnhub,
  fetchStockPriceFromFinnhub,
} from "../utils/finnhubClient.js";
import {
  fetchFullStockDetailsFromFinnhub,
} from "../utils/finnhubClient.js";

import {
  fetchStockCandlesFromFinnhub,
} from "../utils/finnhubClient.js";

import {
  fetchStockCandlesFromYahoo,
} from "../utils/yahooClient.js";

export const getStockCandles = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { range } = req.query;

    const data = await fetchStockCandlesFromYahoo(symbol, range);

if (!Array.isArray(data) || data.length === 0) {
  return res.status(404).json({
    message: "No candle data found",
  });
}

const candles = {
  t: data.map(d => Math.floor(new Date(d.date).getTime() / 1000)),
  o: data.map(d => d.open),
  h: data.map(d => d.high),
  l: data.map(d => d.low),
  c: data.map(d => d.close),
  v: data.map(d => d.volume),
};

    res.json(candles);
  } catch (error) {
    console.error(
      "Yahoo candle error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch candles",
      error: error.message,
    });
  }
};



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
