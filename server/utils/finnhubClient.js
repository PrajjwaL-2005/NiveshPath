import axios from "axios";

const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
});


// 📈 Get stock candles (for charts)
export const fetchStockCandlesFromFinnhub = async (
  symbol,
  resolution,
  from,
  to
) => {
  const response = await finnhub.get("/stock/candle", {
    params: {
      symbol,
      resolution,
      from,
      to,
      token: process.env.FINNHUB_API_KEY,
    },
  });

  return response.data;
};


// 🔍 Search stocks
export const searchStocksFromFinnhub = async (query) => {
  const response = await finnhub.get("/search", {
    params: {
      q: query,
      token: process.env.FINNHUB_API_KEY,
    },
  });
  return response.data.result;
};

// 💰 Get stock price
export const fetchStockPriceFromFinnhub = async (symbol) => {
  const response = await finnhub.get("/quote", {
    params: {
      symbol,
      token: process.env.FINNHUB_API_KEY,
    },
  });
  return response.data;
};
// 📊 Get full stock details
export const fetchFullStockDetailsFromFinnhub = async (symbol) => {
    const token = process.env.FINNHUB_API_KEY;
  
    // Run requests in parallel (fast)
    const [
      profileRes,
      quoteRes,
      metricsRes,
    ] = await Promise.all([
      finnhub.get("/stock/profile2", {
        params: { symbol, token },
      }),
      finnhub.get("/quote", {
        params: { symbol, token },
      }),
      finnhub.get("/stock/metric", {
        params: { symbol, metric: "all", token },
      }),
    ]);
  
    return {
      profile: profileRes.data,
      price: quoteRes.data,
      metrics: metricsRes.data.metric,
    };
  };
  
export default finnhub;
