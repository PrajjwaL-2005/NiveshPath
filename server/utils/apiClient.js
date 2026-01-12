import axios from "axios";

export const fetchStockPrice = async (symbol) => {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    const { data } = await axios.get(url);

    const quote = data["Global Quote"];
    if (!quote) throw new Error("API limit reached");

    return {
      price: Number(quote["05. price"]),
      changePercent: quote["10. change percent"],
      volume: quote["06. volume"]
    };
  } catch {
    return { price: 100, changePercent: "0%", volume: 0 }; // fallback mock
  }
};
