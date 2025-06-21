import { JSX } from "react";
import { IconProps } from "../../types/types";

interface SidebarItemProps {
  id: number;
  icon: (props: IconProps) => JSX.Element;
  title: string;
  isActive: boolean;
  onClick: (id: number, title: string) => void;
}

function SidebarItem(props: SidebarItemProps) {
  const Icon = props.icon;
  const hoverStyles =
    "hover:bg-slate-200 hover:rounded-full hover:cursor-pointer";
  const activeStyles = "bg-purple-300 text-purple-500 rounded-full";
  const iconColor = props.isActive ? "#3e38a7" : "oklch(0.446 0.043 257.281)";

  return (
    <div
      className={`flex items-center px-4 py-2 gap-2 ${hoverStyles} ${
        props.isActive && activeStyles
      }`}
      onClick={() => props.onClick(props.id, props.title)}
    >
      <Icon width={20} height={20} color={iconColor} />
      <p className="">{props.title}</p>
    </div>
  );
}

export default SidebarItem;
