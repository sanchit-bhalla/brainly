import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import axios from "../utils/axios";

type FailedRequestCallback = (token: string) => void;

const useAxios = () => {
  const { accessToken, refreshToken, setIsAuthenticated, login } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [failedRequests, setFailedRequests] = useState<FailedRequestCallback[]>(
    []
  );

  const refreshTokens = useCallback(async () => {
    setIsRefreshing(true);

    // Call API to refresh access and refresh token
    try {
      const response = await axios.post(`/api/v1/users/refresh-token`, {
        refreshToken,
      });

      const newAccessToken = response.data?.data?.accessToken;

      // process all requests that failed while refreshing token
      failedRequests.forEach((cb) => cb(newAccessToken));
      setFailedRequests([]);

      login(response.data?.data);

      return newAccessToken;
    } catch (err) {
      console.log("Failed to refresh Tokens: ", err);
      setIsAuthenticated(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, failedRequests, login]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (err) => {
        const originalRequest = err.config;

        if (
          err.response?.status === 401 &&
          err.response?.data?.message === "Invalid Access Token" &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            return new Promise((resolve) => {
              setFailedRequests((prev) => [
                ...prev,
                (token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(axios(originalRequest));
                },
              ]);
            });
          }
          originalRequest._retry = true;
          const newAccessToken = await refreshTokens();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, isRefreshing, refreshTokens]);

  return axios;
};

export default useAxios;
