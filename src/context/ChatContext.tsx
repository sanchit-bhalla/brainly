import axios from "../utils/axios";
import { createContext, ReactNode, useState } from "react";
import { BACKEND_HOST } from "../constants";
import { ChatContextType, Message } from "../../types/types";

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, { ...message }]);
  };

  const handleAskQuery = async (query: string) => {
    try {
      if (!query || !query?.trim()) return;

      setLoading(true);
      setErrorMsg("");

      addMessage({
        role: "user",
        content: query,
      });

      await new Promise((res) => setTimeout(res, 5000));
      const response = await axios({
        url: `${BACKEND_HOST}/api/v1/chat/?prompt=${query}`,
        method: "GET",
        withCredentials: true,
      });

      addMessage({
        role: "assistant",
        content: response?.data?.data?.response,
        references: response?.data?.data?.references,
      });
    } catch (err) {
      console.log(err);
      setErrorMsg(
        "Could not get the response for the query. Please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        errorMsg,
        handleAskQuery,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
