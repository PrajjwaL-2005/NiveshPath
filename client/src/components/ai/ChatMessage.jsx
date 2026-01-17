import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ role, text }) => {
  return (
    <div className={role === "user" ? "text-right" : "text-left"}>
      <div
        className={`inline-block max-w-[85%] rounded-lg px-4 py-2 prose prose-sm
          ${role === "user"
            ? "bg-blue-600 text-white prose-invert"
            : "bg-gray-100 text-gray-900"
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
