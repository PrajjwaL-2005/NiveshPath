import api from "./api";

// ✅ Named export
export const fetchMarketNews = () => {
  return api.get("/news/market");
};

export const fetchCompanyNews = (symbol) => {
  return api.get(`/news/company/${symbol}`);
};
