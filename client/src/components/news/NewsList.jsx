import { useEffect, useState } from "react";
import { fetchMarketNews } from "../../services/newsService";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketNews()
      .then(res => setNews(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <h3 className="font-semibold">{item.headline}</h3>
          <p className="text-sm text-gray-600">{item.summary}</p>
        </a>
      ))}
    </div>
  );
};

export default NewsList;
