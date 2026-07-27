import api from "./api";

export const searchStocks = (query) =>
  api.get(`/stocks/search?q=${encodeURIComponent(query)}`);


export const getStockQuote = async (symbol) => {
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

export const getStockDetails = async (symbol) => {
  const response = await api.get(`/stocks/${symbol}/details`);
  return response.data;
};

export const getStockCandles = async (symbol, range) => {
  const response = await api.get(
    `/stocks/${symbol}/candles?range=${range}`
  );
  return response.data;
};
