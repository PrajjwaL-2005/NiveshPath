import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getStockCandles } from "../../services/stockService";
import Loader from "../common/Loader";

// Register chart components (IMPORTANT)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const ranges = ["1D", "7D", "1M", "1Y", "ALL"];

const PriceChart = ({ symbol }) => {
  const [range, setRange] = useState("1M");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        setLoading(true);
        const res = await getStockCandles(symbol, range);

        const labels = res.t.map((time) =>
          new Date(time * 1000).toLocaleDateString()
        );

        const prices = res.c;

        setChartData({
          labels,
          datasets: [
            {
              label: "Price",
              data: prices,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to load chart data", err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCandles();
  }, [symbol, range]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Price Chart</h3>

        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-sm rounded ${
                range === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {/* Chart */}
{loading ? (
  <Loader />
) : !chartData ? (
  <p className="text-center text-gray-500">
    No chart data available
  </p>
) : (
  <div className="h-64 w-full"> {/* 👈 FIXED HEIGHT */}
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false, // 👈 IMPORTANT
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `₹ ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: { display: false },
          y: {
            ticks: {
              callback: (value) => `₹ ${value}`,
            },
          },
        },
      }}
    />
  </div>
)}

    </div>
  );
};

export default PriceChart;
