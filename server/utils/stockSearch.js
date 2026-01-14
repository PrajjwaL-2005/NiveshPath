import axios from "axios";

export const searchStocksFromAPI = async (query) => {
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

  const { data } = await axios.get(url);

  if (!data.bestMatches) return [];

  return data.bestMatches.map(stock => ({
    symbol: stock["1. symbol"],
    name: stock["2. name"],
    region: stock["4. region"],
    currency: stock["8. currency"]
  }));
};
