import { useContext } from "react";
import { BrainContext } from "../context/BrainContext";

function useBrain() {
  const context = useContext(BrainContext);

  if (!context) {
    // return {};
    throw new Error("useBrain must be used within the BrainProvider");
  }
  return context;
}

export default useBrain;
