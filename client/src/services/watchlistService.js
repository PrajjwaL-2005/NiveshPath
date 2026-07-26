import api from "./api";

export const getWatchlist = () => api.get("/watchlist");

export const addToWatchlist = (symbol) => api.post("/watchlist", { symbol });

export const removeFromWatchlist = (symbol) => api.delete(`/watchlist/${symbol}`);
