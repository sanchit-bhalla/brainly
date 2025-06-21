import { createContext, ReactNode, useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import { BACKEND_HOST } from "../constants";
import { BrainContent } from "../../types/types";
import { useLocation } from "react-router-dom";

interface BrainContextType {
  loading: boolean;
  error: string | null;
  brain: BrainContent[];
  refetchBrain: () => void;
}

export const BrainContext = createContext<BrainContextType | undefined>(
  undefined
);

export const BrainProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const axios = useAxios();
  const [contentCounter, setContentCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brain, setBrain] = useState<BrainContent[]>([]);

  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const queryParam = searchParams.get("q");

  const refetchBrain = () => {
    setContentCounter((prev) => prev + 1);
  };

  console.log({ pathname });
  useEffect(() => {
    const fetchBrainContents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios({
          url: pathname.includes("/brain/")
            ? `${BACKEND_HOST}/api/v1${pathname}?q=${queryParam}`
            : `${BACKEND_HOST}/api/v2/content?q=${queryParam}`,
          method: "GET",

          withCredentials: true,
        });

        setBrain(response?.data?.data || []);
      } catch (err) {
        console.log(err);
        setError("Error occured while fetching brain contents");
      } finally {
        setLoading(false);
      }
    };

    fetchBrainContents();
  }, [contentCounter, pathname, queryParam]);

  return (
    <BrainContext.Provider value={{ loading, error, brain, refetchBrain }}>
      {children}
    </BrainContext.Provider>
  );
};
