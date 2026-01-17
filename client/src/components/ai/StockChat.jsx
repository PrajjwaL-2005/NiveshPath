import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import api from "../../services/api";

const StockChat = ({ symbol, stockData }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question) => {
    if (!question.trim()) return;

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

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Failed to get AI response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-6 flex flex-col">
      <h3 className="font-semibold text-lg mb-3">
        🤖 Ask AI about {symbol}
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <p className="text-sm text-gray-400">Thinking...</p>
        )}
      </div>

      <ChatInput onSend={askQuestion} disabled={loading} />
    </div>
  );
};

export default StockChat;
