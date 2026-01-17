import api from "./api";

export const getPortfolio = () => {
  return api.get("/portfolio");
};
