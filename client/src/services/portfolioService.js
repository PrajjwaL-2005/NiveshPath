import api from "./api";

export const getPortfolio = () => {
  return api.get("/portfolio");
};

export const getTrades = () => {
  return api.get("/portfolio/trades");
};
