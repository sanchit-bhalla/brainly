import axios from "../utils/axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { BACKEND_HOST } from "../constants";

interface User {
  // id: string;
  username: string;
  email: string;
}
interface LoginType {
  user?: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  loading: boolean;
  user: User | null;
  refreshToken: string | null;
  accessToken: string | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (loginResponse: LoginType) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const resetTokens = async () => {
      try {
        // console.log({ refreshToken });
        // if (!refreshToken) throw new Error("Refresh token not present");

        // Even if refresh Token not present in not present in the memory( i.e refreshToken is null), it might be set in httpOnly cookie, so backend can access it from there
        const response = await axios.post(
          `${BACKEND_HOST}/api/v1/users/refresh-token`,
          {
            refreshToken,
          }
        );
        // console.log("AFTER REFRESHING TOKEN: ", response.data);

        login(response.data?.data);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    resetTokens();
  }, []);

  const login = (loginResponse: LoginType) => {
    try {
      const { accessToken, refreshToken, user } = loginResponse;

      // For security reasons, don't store tokens in local Storage. Instead store it in memory(state) only
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);

      setIsAuthenticated(true);
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      if (user) setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_HOST}/api/v1/users/logout`);

      setIsAuthenticated(false);
      setUser(null);
      setRefreshToken(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        user,
        loading,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
