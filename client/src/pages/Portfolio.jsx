import { useEffect, useState } from "react";
import api from "../services/api";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    api.get("/portfolio").then((res) => {
      setPortfolio(res.data.holdings);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Portfolio</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Symbol</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Avg Buy</th>
          </tr>
        </thead>

        <tbody>
          {portfolio.map((stock) => (
            <tr key={stock._id}>
              <td className="p-2 border">{stock.symbol}</td>
              <td className="p-2 border">{stock.quantity}</td>
              <td className="p-2 border">₹{stock.avgBuyPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
