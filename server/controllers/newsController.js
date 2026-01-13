import axios from "axios";

/* ============================
   GET MARKET NEWS
============================ */
export const getMarketNews = async (req, res) => {
  try {
    const { category = "general" } = req.query;

    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${process.env.FINNHUB_API_KEY}`;
    const { data } = await axios.get(url);

    res.json(data.slice(0, 20)); // limit results
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch market news" });
  }
};

/* ============================
   GET COMPANY NEWS
============================ */
export const getCompanyNews = async (req, res) => {
  try {
    const { symbol } = req.params;

    const from = "2025-01-01";
    const to = new Date().toISOString().split("T")[0];

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`;
    const { data } = await axios.get(url);

    res.json(data.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch company news" });
  }
};
