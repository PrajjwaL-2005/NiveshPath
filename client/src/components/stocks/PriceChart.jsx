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
              borderColor: "#4f46e5",
              backgroundColor: "rgba(79, 70, 229, 0.08)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
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
    <div className="bg-white rounded-2xl shadow-soft p-6 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Price Chart</h3>

        <div className="flex gap-1.5 bg-slate-100 rounded-lg p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                range === r
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <Loader />
      ) : !chartData ? (
        <p className="text-center text-slate-500">
          No chart data available
        </p>
      ) : (
        <div className="h-64 w-full">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: "#1e293b",
                  padding: 10,
                  cornerRadius: 8,
                  callbacks: {
                    label: (ctx) => `₹ ${ctx.parsed.y}`,
                  },
                },
              },
              scales: {
                x: { display: false },
                y: {
                  grid: { color: "#f1f5f9" },
                  ticks: {
                    color: "#64748b",
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
