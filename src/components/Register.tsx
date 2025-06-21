// Register.tsx
import React, { useState } from "react";
import Input from "./Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import axios from "axios";
import { BACKEND_HOST } from "../constants";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await axios.post(`${BACKEND_HOST}/api/v1/users/signup`, {
        username,
        email,
        password,
      });

      navigate("/login");
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
    <div className="col-span-full flex justify-center items-center ">
      <div className="w-96 p-6 -mt-20 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
            disabled={!username || !email || !password}
            extraStyles="w-full w-max-sm"
          />
        </form>
        {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Signin here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
