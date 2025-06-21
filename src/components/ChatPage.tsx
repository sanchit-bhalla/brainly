import React from "react";
import ChatFooter from "./ChatFooter";
import Logo from "./Logo";
import ChatContent from "./ChatContent";

const ChatPage: React.FC = () => {
  return (
    <div className="relative h-screen bg-slate-100 bg-img overflow-y-auto flex flex-col">
      <div className="p-4 mb-4 sticky top-0 left-0 right-0 bg-slate-50  xl:bg-transparent">
        <Logo />
      </div>

      <ChatContent />

      <ChatFooter />
    </div>
  );
};

export default ChatPage;
