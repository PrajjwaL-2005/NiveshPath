import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        placeholder="Ask about this stock..."
      />
      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        Ask
      </button>
    </div>
  );
};

export default ChatInput;
