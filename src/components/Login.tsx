import React, { useState } from "react";
import Input from "./Input";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BACKEND_HOST } from "../constants";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await axios.post(
        `${BACKEND_HOST}/api/v1/users/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      login(response.data?.data);
    } catch (error) {
      let errorMsg = "Some error occured";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Status:", error.response.status);
          console.log("Data:", error.response.data);
          console.log("Headers:", error.response.headers);
          errorMsg =
            error?.response?.data?.errors?.issues?.[0]?.message ||
            error?.response?.data?.message ||
            "Some Error occured!";
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error:", error.message);
          errorMsg = error?.message || "Some error occured!";
        }
      } else {
        console.log("Unexpected Error:", error);
      }
      setErrorMsg(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-full flex justify-center items-center">
      <div className="w-96 p-6 -mt-20 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            title="Submit"
            size="md"
            variant="primary"
            loading={loading}
            disabled={!email || !password}
            extraStyles="w-full w-max-sm"
          />
        </form>
        {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
        <p className="mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
