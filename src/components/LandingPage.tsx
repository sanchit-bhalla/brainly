import { useNavigate } from "react-router-dom";
import BrainIcon from "../icons/BrainIcon";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME } from "../constants";
import brainImage from "../images/brain.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const username = user?.username || "Guest";

  return (
    <nav className="sticky top-0 z-50 bg-navbg shadow-md transition-transform ease-in-out text-navtext">
      <div className="container mx-auto flex items-center gap-6 py-4 px-6">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <BrainIcon width={25} height={25} color="#334155" />
          <span className="text-lg font-bold ml-1 cursor-pointer hover:text-purple-600">
            {APP_NAME}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <span
            className="text-lg font-semibold cursor-pointer hover:text-purple-600"
            onClick={() => navigate("/brain")}
          >
            Documents
          </span>

          <span
            className="text-lg font-semibold cursor-pointer hover:text-purple-600"
            onClick={() => navigate("/brain")}
          >
            Get Started
          </span>
        </div>

        {isAuthenticated ? (
          <div className="ml-auto hidden md:flex space-x-6">
            <span
              className="text-lg font-semibold cursor-pointer hover:text-purple-600"
              onClick={() => navigate("/chat")}
            >
              Query Brain
            </span>

            <span className="text-lg font-semibold  text-purple-600">
              Welcome {username} !
            </span>
          </div>
        ) : (
          <span
            className="ml-auto text-lg font-semibold cursor-pointer hover:text-purple-600"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        )}
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen -mt-[60px] flex-col items-center justify-center gap-8 bg-[#f8fafc] text-center px-6 md:flex md:flex-row-reverse md:items-center bg-img">
      <div className="w-max-[80%] flex justify-center items-center p-6 bg-grad">
        <img src={brainImage} alt="Brain image" />
      </div>
      <div className="max-w-3xl  text-navtext">
        {/* Title */}
        <h1 className="text-5xl font-bold mt-6">
          <p>{APP_NAME} - Your AI powered</p>
          <p className="text-purple-600 mt-2">Second Brain</p>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-700 mt-6">
          {APP_NAME} is an advanced, scalable platform for intelligent content
          retrieval, management, and sharing—powered by OpenAI & LangChain..
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate("/brain")}
            className="px-6 py-3 bg-purple-600 text-white font-semibold text-lg rounded-md shadow-md hover:bg-purple-700 transition cursor-pointer"
          >
            Get Started
          </button>

          <button
            className="px-6 py-3 border border-gray-400 text-lg font-semibold rounded-md shadow-md flex items-center cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            Query Brain
          </button>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  );
};

export default LandingPage;
