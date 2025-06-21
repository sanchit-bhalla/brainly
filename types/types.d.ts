export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export interface BrainContent {
  _id: string;
  link: string;
  title: string;
  type: string;
  tags: string[];
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

export interface NotificationProps {
  message: string;
  duration: number; // duration in milliseconds
  animationDelay: number;
  variant?: "success" | "fail" | "neutral";
}

interface HeaderProps {
  loggedInUserHeader?: boolean;
}

export interface MessageReference {
  title: string;
  link: string;
  mimetype: "text/plain" | "application/pdf" | "youtube";
}
export interface Message {
  // id: string;
  role: "user" | "assistant";
  content: string;
  references?: MessageReference[] | [];
}

export interface ChatContextType {
  messages: Message[] | [];
  loading: boolean;
  errorMsg: string;
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  // addMessage: (msg: Message) => void;
  handleAskQuery: (query: string) => Promise<void>;
}
