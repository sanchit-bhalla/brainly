import { ReactNode } from "react";
import LoadingIcon from "../icons/LoadingIcon";

interface ButtonProps {
  title: string;
  size: "lg" | "sm" | "md";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant: "primary" | "secondary" | "danger" | "neutral" | "gradient";
  loading?: boolean;
  disabled?: boolean;
  extraStyles?: string;
  // onClick?: (e?: React.MouseEventHandler<HTMLButtonElement>) => void;
  onClick?: () => void;
}

const sizeStyles = {
  sm: "px-2 py-1 text-sm rounded-sm",
  md: "px-4 py-2 text-md rounded-md",
  lg: "px-8 py-4 text-xl rounded-xl",
};

const variantStyles = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-300 text-purple-600",
  danger: "bg-red-500 text-white uppercase",
  neutral: "bg-slate-200 text-black",
  // gradient: "bg-gradient-to-r from-[#8ec5fc] to-[#e0c3fc] text-slate-800",
  gradient: "bg-white text-purple-600",
};

const ApplyGradient: React.FC<{
  variant: string;
  children: React.ReactNode;
}> = ({ variant, children }) => {
  if (variant === "gradient")
    return (
      <div className="relative group ">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8ec5fc] to-[#e0c3fc] rounded-lg blur opacity-80 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        {children}
      </div>
    );
  else return children;
};

function Button(props: ButtonProps) {
  const StartIcon = props.startIcon;
  const EndIcon = props.endIcon;
  const loadingStyles =
    props.loading || props.disabled
      ? "opacity-80"
      : "opacity-95 hover:opacity-100 cursor-pointer";

  return (
    <ApplyGradient variant={props.variant}>
      <button
        className={`relative flex justify-center items-center gap-2 ${loadingStyles} ${
          sizeStyles[props.size]
        } ${variantStyles[props.variant]} ${props.extraStyles} `}
        disabled={props.disabled || props.loading}
        onClick={(e) => {
          e.stopPropagation();
          if (props.onClick) props.onClick();
        }}
      >
        {props.loading && <LoadingIcon />}

        {StartIcon ? StartIcon : null}
        <div>{props.loading ? "Please wait..." : props.title}</div>
        {EndIcon ? EndIcon : null}
      </button>
    </ApplyGradient>
  );
}

export default Button;
