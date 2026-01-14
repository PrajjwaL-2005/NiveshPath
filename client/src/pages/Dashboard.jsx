const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your portfolio and market activity
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Wallet Balance"
          value="₹100,000"
          color="text-green-600"
        />
        <StatCard
          title="Invested Amount"
          value="₹75,000"
        />
        <StatCard
          title="Total P&L"
          value="+₹12,500"
          color="text-green-600"
        />
        <StatCard
          title="Active Stocks"
          value="8"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* STOCKS SECTION */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Stocks
          </h3>

          <div className="border rounded-lg p-4 text-gray-500 text-sm">
            Stock list, price changes, charts, and P&L will appear here.
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Bought TCS (5 shares)</li>
            <li>• Sold INFY (2 shares)</li>
            <li>• Wallet credited ₹10,000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/* Reusable Stat Card */
const StatCard = ({ title, value, color = "text-gray-800" }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
};

export default Dashboard;
