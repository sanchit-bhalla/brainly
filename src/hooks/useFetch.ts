import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { BACKEND_HOST } from "../constants";
import useAxios from "./useAxios";

interface FetchParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE"; // Add other methods if needed
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
}

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>({
  url,
  method = "GET",
  body,
  headers,
}: FetchParams): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const config: AxiosRequestConfig = {
          url: `${BACKEND_HOST}/${url}`,
          method,
          headers,
          data: body,
          signal,
          withCredentials: true, // Ensure credentials are sent with the request
        };
        const response = await axiosInstance(config);
        setData(response.data);
      } catch (err) {
        if (signal.aborted) {
          console.log("Request canceled");
        } else {
          setError("Something went wrong");
        }
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url, method, body, headers, axiosInstance]);

  return { data, loading, error };
}

export default useFetch;
