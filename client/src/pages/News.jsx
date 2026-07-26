import MarketNews from "../components/news/MarketNews";

const News = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Market News</h2>
      <MarketNews />
    </div>
  );
};

export default News;
