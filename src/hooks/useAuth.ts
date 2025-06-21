import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // return {};
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
