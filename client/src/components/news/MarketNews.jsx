import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { fetchMarketNews } from "../../services/newsService";

const MarketNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchMarketNews().then(res => setNews(res.data));
  }, []);

  return (
    <div className="space-y-3">
      {news.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="group block p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:border-brand-200 hover:shadow-card hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">
              {item.headline}
            </h3>
            <ExternalLink size={14} className="shrink-0 mt-1 text-slate-300 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-sm text-slate-500 mt-1">{item.summary}</p>
        </a>
      ))}
    </div>
  );
};

export default MarketNews;
