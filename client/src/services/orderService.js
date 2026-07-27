import api from "./api";

/**
 * Place a limit or stop-loss order (executed asynchronously by the server's
 * background order worker once the trigger price is hit).
 */
export const placeOrder = ({ symbol, side, orderType, triggerPrice, quantity, expiresAt }) => {
  return api.post("/orders", { symbol, side, orderType, triggerPrice, quantity, expiresAt });
};

export const getOrders = ({ status, page = 1, limit = 20 } = {}) => {
  return api.get("/orders", { params: { status, page, limit } });
};

export const cancelOrder = (orderId) => {
  return api.delete(`/orders/${orderId}`);
};
