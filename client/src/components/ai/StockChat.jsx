import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import api from "../../services/api";

const StockChat = ({ symbol, stockData }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question) => {
    if (!question.trim()) return;

    // Recent turns, sent so the assistant keeps context across follow-ups
    const history = messages.slice(-6);

    setLoading(true);

    // Add user message immediately
    setMessages(prev => [
      ...prev,
      { role: "user", text: question }
    ]);

    try {
      const res = await api.post("/ai/stock-chat", {
        symbol,
        question,
        stockData,
        history,
      });

      // ✅ Always read exactly what backend sends
      const replyText =
        res?.data?.reply ??
        "⚠️ Backend returned no response";

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: replyText }
      ]);

    } catch (err) {
      console.error("Chat error:", err);

      const status = err.response?.status;
      const text =
        status === 401
          ? "⚠️ Your session has expired. Please log out and log in again."
          : err.response?.data?.message
            ? `⚠️ ${err.response.data.message}`
            : "⚠️ Failed to get AI response";

      setMessages(prev => [
        ...prev,
        { role: "assistant", text },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 text-white">
          <Bot size={16} />
        </span>
        <h3 className="font-semibold text-slate-800">
          Ask AI about {symbol}
        </h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-3 pr-1">
        {messages.length === 0 && !loading && (
          <p className="text-sm text-slate-400">
            Ask a beginner-friendly question about {symbol} — e.g. "Is this a large or small company?"
          </p>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles size={14} className="animate-pulse text-brand-400" />
            Thinking...
          </div>
        )}
      </div>

      <ChatInput onSend={askQuestion} disabled={loading} />
    </div>
  );
};

export default StockChat;
