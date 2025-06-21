import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { BACKEND_HOST } from "../constants";
import ProgressBar from "./ProgressBar/ProgressBar";
import NotFound from "./NotFound";
import Header from "./Header";
import Home from "./Home";

interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function PublicBrain() {
  const { hash } = useParams();

  // check if hash(public brain link) is loggedIn user's hash(public brain link) or not
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // check if hash belong's to loggedin user
    const verifyHash = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance({
          url: `${BACKEND_HOST}/api/v1/brain/verifyHash`,
          method: "POST",
          data: { hash },
          signal,
          withCredentials: true, // Ensure credentials are sent with the request
        });

        if (response?.data?.data?.verified)
          navigate("/brain", { replace: true });
        setLoading(false);
      } catch (err) {
        const error = err as CustomError;
        if (error.response?.data?.message === "Invalid hash")
          setError("Invalid hash");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      verifyHash();
    } else {
      setLoading(false);
    }

    return () => {
      abortController.abort();
    };
  }, [hash, isAuthenticated]);

  if (loading) return <ProgressBar />;
  if (error) return <NotFound />;
  return (
    <div className="min-h-screen bg-slate-100 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-img">
      <Header loggedInUserHeader={false} />

      <Home />
    </div>
  );
}

export default PublicBrain;
