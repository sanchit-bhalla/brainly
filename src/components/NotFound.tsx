import NotFoundIcon from "../icons/NotFoundIcon";
import Logo from "./Logo";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 bg-img">
      <div className="p-4">
        <Logo />
      </div>
      <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
        <NotFoundIcon width={300} height={300} />
        <h1 className="text-2xl font-semibold text-center font-sans text-gradient">
          Invalid URL
        </h1>
      </div>
    </div>
  );
}

export default NotFound;
