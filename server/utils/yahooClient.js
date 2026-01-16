import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const fetchStockCandlesFromYahoo = async (symbol, range) => {
  let yahooSymbol = symbol.toUpperCase();

// If symbol already has exchange (AAPL, AAPL.US, INFY.NS)
if (yahooSymbol.includes(".")) {
  // do nothing
} else {
  // Heuristic: Indian stocks are usually NOT all caps US tickers
  // Default rule: treat common US stocks as US, rest as NSE
  const usStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"];

  if (!usStocks.includes(yahooSymbol)) {
    yahooSymbol = `${yahooSymbol}.NS`;
  }
}


  const now = new Date();
  let from;
  let interval;

  switch (range) {
    case "1D":
      from = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      interval = "1d";
      break;

    case "7D":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      interval = "1d";
      break;

    case "1M":
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      interval = "1d";
      break;

    case "1Y":
      from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      interval = "1wk";
      break;

    case "ALL":
      from = new Date(now.getTime() - 15 * 365 * 24 * 60 * 60 * 1000);
      interval = "1mo";
      break;

    default:
      throw new Error("Invalid range");
  }

  // ✅ DEFINE result properly
  const result = await yahooFinance.historical(yahooSymbol, {
    period1: from,
    period2: now,
    interval,
  });

  return result; // ✅ now this exists
};
