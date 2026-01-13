import MarketNews from "../components/news/MarketNews";

const Dashboard = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <MarketNews />
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-bold">Wallet Balance</h3>
        <p className="text-2xl">₹100,000</p>
      </div>
    </div>
  );
};

export default Dashboard;
