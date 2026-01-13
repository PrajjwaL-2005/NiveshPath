import api from "./api";

export const fetchMarketNews = () =>
  api.get("/news/market");

export const fetchCompanyNews = (symbol) =>
  api.get(`/news/company/${symbol}`);
