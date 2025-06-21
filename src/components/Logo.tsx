import { useNavigate } from "react-router-dom";
import BrainIcon from "../icons/BrainIcon";
import { APP_NAME } from "../constants";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center gap-1 cursor-pointer "
      onClick={() => navigate("/")}
    >
      <BrainIcon width={40} height={40} />

      <h2 className="text-4xl text-gradient font-semibold font-sans tracking-tight -mt-1.5">
        {APP_NAME}
      </h2>
    </div>
  );
}

export default Logo;
