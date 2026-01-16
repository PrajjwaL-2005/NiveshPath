import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { time: "09:15", price: 150 },
  { time: "10:00", price: 152 },
  { time: "11:00", price: 148 },
  { time: "12:00", price: 151 },
  { time: "13:00", price: 155 },
];

const PriceChart = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-80">
      <h3 className="text-lg font-semibold mb-4">
        Price Chart (1D)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
