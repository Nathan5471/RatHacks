import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../utils/AuthAPIHandler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getUser } = useAuth();

  const handleLogin = async () => {
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    } else if (!password) {
      setError("Password is required");
      return;
    }
    try {
      await login({ email, password });
      getUser();
      navigate("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <div className="w-80 bg-gray-200 flex flex-col items-center justify-center p-2">
        <div className="flex flex-row">
          <h3>Email:</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-row">
          <h3>Password:</h3>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleLogin} className="bg-gray-400 p-2 rounded-md">
          Login
        </button>
      </div>
    </div>
  );
}
