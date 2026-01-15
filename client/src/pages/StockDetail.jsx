import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStockDetails } from "../services/stockService";
import Loader from "../components/common/Loader";

const StockDetail = () => {
  const { symbol } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getStockDetails(symbol);
        setData(res);
      } catch (err) {
        console.error("Failed to load stock details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol]);

  if (loading) return <Loader />;
  if (!data) return <p>No data available</p>;

  const { profile, price, metrics } = data;

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">
        {profile.name} ({profile.ticker})
      </h1>
      <p className="text-gray-500">{profile.exchange}</p>

      {/* Price */}
      <div className="mt-4">
        <p className="text-xl font-semibold">
          ₹ {price.c}
        </p>
        <p className="text-sm text-gray-500">
          Open: {price.o} | High: {price.h} | Low: {price.l}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>Market Cap: {profile.marketCapitalization}</div>
        <div>P/E: {metrics.peBasicExclExtraTTM}</div>
        <div>52W High: {metrics["52WeekHigh"]}</div>
        <div>52W Low: {metrics["52WeekLow"]}</div>
      </div>

      {/* Description */}
      <p className="mt-6 text-gray-700">
        {profile.description}
      </p>
    </div>
  );
};

export default StockDetail;
