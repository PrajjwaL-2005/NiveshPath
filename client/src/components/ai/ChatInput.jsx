import { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
        className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
        placeholder="Ask about this stock..."
      />
      <button
        onClick={submit}
        disabled={disabled || !input.trim()}
        className="flex items-center justify-center h-10 w-10 shrink-0 bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-xl shadow-soft transition-all duration-200 hover:shadow-brand disabled:opacity-40 disabled:pointer-events-none"
        aria-label="Send question"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default ChatInput;
