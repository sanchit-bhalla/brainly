import React from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  id: string;
}

const Portal: React.FC<PortalProps> = ({ children, id }) => {
  return ReactDOM.createPortal(children, document.getElementById(id)!);
};

export default Portal;
