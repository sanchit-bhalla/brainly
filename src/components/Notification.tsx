import React, { useEffect, useRef, useState } from "react";
import Portal from "./Portal";
import { CSSTransition } from "react-transition-group";
import { NotificationProps } from "../../types/types";

const variantStyles = {
  success: "border-l-green-500 bg-green-50",
  fail: "border-l-red-500 bg-red-50",
  neutral: "border-l-[#0082d2] bg-white",
};

const variantIcon = {
  success: "✅",
  fail: "❌",
  neutral: "",
};

const Notification: React.FC<NotificationProps> = ({
  message,
  duration = 2000,
  variant = "neutral",
}) => {
  const [show, setShow] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // if (!show || !message) return null;
  return (
    <Portal id="notification-root">
      <CSSTransition
        in={show}
        timeout={300}
        classNames="slide"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className={`fixed right-2 bottom-4 px-4 py-2 rounded-md text-black font-sans shadow-lg border-l-6 ${variantStyles[variant]}`}
        >
          {message} {variantIcon[variant]}
        </div>
      </CSSTransition>
    </Portal>
  );
};

export default Notification;
