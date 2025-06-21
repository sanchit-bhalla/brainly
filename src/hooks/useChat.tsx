import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    // return {};
    throw new Error("useChat must be used within the ChatProvider");
  }
  return context;
}

export default useChat;
