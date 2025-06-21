import { createContext, useEffect, useState } from "react";
import { NotificationProps } from "../../types/types";
import Notification from "../components/Notification";

interface NotificationContextProps {
  addNotification: (
    message: string,
    duration: number,
    animationDelay: number,
    variant?: "success" | "fail" | "neutral"
  ) => void;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationProps | null>(null);

  const addNotification = (
    message: string,
    duration = 2000,
    animationDelay = 300,
    variant: "success" | "fail" | "neutral" = "neutral"
  ) => {
    setNotifications((prev) => [
      ...prev,
      { message, duration, variant, animationDelay },
    ]);
  };

  useEffect(() => {
    if (!currentNotification && notifications.length) {
      setCurrentNotification(notifications[0]);
      setNotifications((prev) => prev.slice(1));
    }

    if (currentNotification) {
      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, currentNotification.duration + currentNotification.animationDelay);

      return () => clearTimeout(timer);
    }
  }, [currentNotification, notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {currentNotification && <Notification {...currentNotification} />}
    </NotificationContext.Provider>
  );
};
