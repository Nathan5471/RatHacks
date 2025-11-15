import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../utils/AuthAPIHandler";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await getUser();
      navigate("/app");
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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
      <form
        className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4"
        onSubmit={(e) => handleLogin(e)}
      >
        <h1 className="text-4xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
          Login
        </h1>
        <label htmlFor="email" className="text-2xl">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-surface-a2 p-2 rounded-lg mt-1"
          placeholder="Enter your email"
          required
        />
        <label htmlFor="password" className="text-2xl mt-2">
          Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-2 mt-4 rounded-lg"
        >
          Login
        </button>
        <p className="mt-2 text-center text-gray-200">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-a0 spooky:text-spooky-a0 space:text-space-a0 hover:underline"
          >
            Register here.
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-200">
          Forgot your password?{" "}
          <Link
            to="/reset-password"
            className="text-primary-a0 spooky:text-spooky-a0 space:text-space-a0 hover:underline"
          >
            Reset it here.
          </Link>
        </p>
      </form>
    </div>
  );
}
