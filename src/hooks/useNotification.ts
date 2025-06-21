import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    // return {};
    throw new Error(
      "useNotification must be used within the NotificationProvider"
    );
  }
  return context;
};
