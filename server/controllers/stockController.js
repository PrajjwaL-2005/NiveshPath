import { fetchStockPrice } from "../utils/apiClient.js";

export const searchStock = async (req, res) => {
  const { symbol } = req.params;
  const data = await fetchStockPrice(symbol);
  res.json(data);
};
