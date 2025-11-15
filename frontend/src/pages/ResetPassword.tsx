import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  resetPassword,
  checkResetPassword,
  setNewPassword,
} from "../utils/AuthAPIHandler";
import { Link } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get("email") || "";
  const queryToken = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sentResetLink, setSentResetLink] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await checkResetPassword(queryEmail, queryToken);
        setValidToken(true);
      } catch (error: unknown) {
        console.error("Invalid reset token:", error);
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };
    if (queryEmail && queryToken) {
      verifyToken();
    }
  }, [queryEmail, queryToken]);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      await resetPassword(email);
      setSentResetLink(true);
    } catch (error: unknown) {
      console.error("Error sending reset link:", error);
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

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await setNewPassword(queryEmail, queryToken, password);
      navigate("/login");
    } catch (error: unknown) {
      console.error("Error setting new password:", error);
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

  if ((!queryEmail || !queryToken) && !sentResetLink) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
        <form
          className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4"
          onSubmit={handleSendResetLink}
        >
          <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
          <label htmlFor="email" className="text-2xl">
            Email:
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="submit"
            className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 text-white p-2 rounded-lg mt-4"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    );
  }

  if (sentResetLink) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4 items-center">
          <h1 className="text-4xl font-bold text-center mb-4">
            Reset Link Sent
          </h1>
          <p className="text-lg text-center">
            If an account with that email exists, a reset link has been sent.
            Please check your email.
          </p>
          <Link
            to="/login"
            className="mt-4 bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-2 rounded-lg font-bold w-1/2 text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4 items-center">
          <h1 className="text-4xl font-bold text-center mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4 items-center">
          <h1 className="text-4xl font-bold text-center mb-4">
            Invalid or Expired Link
          </h1>
          <p className="text-lg text-center">
            The reset link is invalid or has expired. Please request a new link.
          </p>
          <Link
            to="/reset-password"
            className="mt-4 bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-2 rounded-lg font-bold w-2/3 text-center"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-surface-a0 text-white">
      <form
        className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4"
        onSubmit={handleSetNewPassword}
      >
        <h1 className="text-4xl font-bold mb-4 text-center">Reset Password</h1>
        <label htmlFor="password" className="text-2xl">
          New Password:
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Enter your new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showPassword ? <IoEyeOff /> : <IoEye />}
          </button>
        </div>
        <label htmlFor="confirmPassword" className="text-2xl mt-2">
          Confirm New Password:
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Confirm your new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 text-white p-2 rounded-lg mt-4"
        >
          Set New Password
        </button>
      </form>
    </div>
  );
}
