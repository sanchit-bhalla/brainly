// import Button from "./Button";
import { useState } from "react";
import useChat from "../hooks/useChat";
import SendIcon from "../icons/SendIcon";

const ChatFooter: React.FC = () => {
  const { loading, handleAskQuery } = useChat();

  const [query, setQuery] = useState<string>("");

  const handleSend = () => {
    const currQuery = query;
    setQuery("");
    handleAskQuery(currQuery);
  };

  let btnStyles =
    "rounded-full p-2 bg-[#5da6de] text-white cursor-pointer hover:bg-[#0069c8]";
  if (loading || query?.trim()?.length === 0)
    btnStyles = "rounded-full p-2 bg-slate-300 text-white cursor-none";

  return (
    <div className="sticky bottom-0 w-full pt-4 pb-4 bg-slate-50 xl:bg-transparent">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-4 relative">
        <div className="relative group flex-grow w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8ec5fc] to-[#e0c3fc] rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <textarea
            rows={2}
            className="relative resize-none p-4 pr-14 w-full bg-white  rounded-2xl shadow-2xl h-auto focus:outline-none focus:border-purple-600"
            placeholder="Query Brain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* <span
              role="textbox"
              className="inline-block relative p-4 w-full bg-white  rounded-2xl shadow-2xl h-auto"
              contentEditable
            ></span> */}
        </div>

        {/* <div className="shrink-0">
          <Button
            variant="gradient"
            title="Send"
            size="md"
            startIcon={loading ? null : <SendIcon />}
            onClick={() => handleAskQuery(query)}
            loading={loading}
            disabled={loading || query?.trim()?.length === 0}
          />
        </div> */}

        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleSend}
            className={btnStyles}
            disabled={loading || query?.trim()?.length === 0}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
