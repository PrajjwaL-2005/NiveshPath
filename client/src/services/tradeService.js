import api from "./api";

/**
 * Buy a stock
 * @param {string} symbol - Stock symbol (e.g. INFY)
 * @param {number} quantity - Number of shares
 */
export const buyStock = (symbol, quantity) => {
  return api.post("/trade/buy", {
    symbol,
    quantity
  });
};

/**
 * Sell a stock
 * @param {string} symbol - Stock symbol
 * @param {number} quantity - Number of shares
 */
export const sellStock = (symbol, quantity) => {
  return api.post("/trade/sell", {
    symbol,
    quantity
  });
};
