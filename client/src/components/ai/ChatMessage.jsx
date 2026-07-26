import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ role, text }) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 prose prose-sm
          ${role === "user"
            ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white prose-invert rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
          }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
