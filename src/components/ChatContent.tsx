import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import { MessageReference } from "../../types/types";
import YoutubeIcon from "../icons/YoutubeIcon";
import TextIcon from "../icons/TextIcon";
import PdfOutlineIcon from "../icons/PdfOutlineIcon";
import StarsIcon from "../icons/StarsIcon";

const ChatContent: React.FC = () => {
  const { user } = useAuth();
  const { messages, loading, errorMsg } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const referenceIcon = (type: MessageReference["mimetype"]) => {
    if (type === "youtube")
      return (
        <YoutubeIcon
          width={20}
          height={20}
          // color="oklch(0.446 0.043 257.281)"
          color="#5046e4"
        />
      );
    else if (type === "text/plain")
      return (
        <TextIcon
          width={20}
          height={20}
          // color="oklch(0.446 0.043 257.281)"
          color="#5046e4"
        />
      );
    // if type === "application/pdf"
    else
      return (
        <PdfOutlineIcon
          width={20}
          height={20}
          // color="oklch(0.446 0.043 257.281)"
          color="#5046e4"
        />
      );
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef && messagesEndRef?.current?.scrollIntoView) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, loading]); // Runs when messages update

  if (!messages || messages?.length === 0) {
    return (
      <div className="w-full max-w-4xl grow flex items-center text-center -mt-24 mx-auto">
        <h1 className="w-full text-5xl text-gradient font-semibold leading-14">
          {`Hi ${
            user?.username?.toUpperCase() || "BUDDY"
          }, what should we dive into today?`}
        </h1>
      </div>
    );
  }

  return (
    <div className="grow w-full max-w-4xl mx-auto">
      {messages.map((msg, ind) => (
        <div
          key={ind}
          className={`max-w-[70%] w-fit p-4 rounded-2xl mb-4 ${
            msg.role === "user"
              ? "ml-auto bg-slate-50 shadow-sm"
              : "p-6 mr-auto text-xl text-black"
          }`}
        >
          {/* <h3 className="text-xl">{msg.role}</h3> */}

          {/* <pre className="whitespace-pre-wrap break-words">
            <code>{msg.content}</code>
          </pre> */}

          <ReactMarkdown>{msg.content}</ReactMarkdown>

          {msg.references && (
            <div className="my-2 ">
              {/* <h3 className="text-lg font-semibold_">References:</h3> */}
              <div className="pl-4">
                {msg.references.map((reference) => (
                  <div
                    key={`${reference.mimetype}-${reference.title}-${reference.link}`}
                    className="flex items-center w-fit text-purple-600 gap-2 cursor-pointer"
                    onClick={() => window.open(reference.link, "_blank")}
                  >
                    {referenceIcon(reference.mimetype)}
                    {reference.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {errorMsg && <h3 className="text-md text-red-500">{errorMsg}</h3>}

      {loading && (
        <div className="w-[70%] p-2">
          <div className="flex animate-pulse space-x-4 h-28 bg-gray-200_">
            <span>
              <StarsIcon width={40} height={40} color="#5046e4" />
            </span>

            {/* <div className="size-10 rounded-full bg-slate-200"></div> */}
            <div className="flex-1 space-y-3 py-1">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="h-2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* Invisible div for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContent;
