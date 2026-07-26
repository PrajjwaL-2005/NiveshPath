import api from "./api";

export const getPortfolio = () => {
  return api.get("/portfolio");
};

export const getTrades = ({ page = 1, limit = 20 } = {}) => {
  return api.get("/portfolio/trades", { params: { page, limit } });
};
