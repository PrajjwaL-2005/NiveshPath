import api from "./api";

export const searchStocks = (query) =>
  api.get(`/stocks/search?q=${query}`);


export const fetchStockPrice = (symbol) =>
    api.get(`/stocks/${symbol}`);