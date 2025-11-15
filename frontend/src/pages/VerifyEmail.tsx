import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../utils/AuthAPIHandler";
import { useAuth } from "../contexts/AuthContext";

export default function VerifyEmail() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(email, token);
        setStatus("success");
      } catch (error: unknown) {
        console.error("Verification error:", error);
        setStatus("error");
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
    if (!email || !token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }
    if (status === "verifying") {
      verify();
    }
  }, [email, token, status]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4">
          <h1 className="text-2xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
            Verifying Email...
          </h1>
          <p className="text-center">Please wait while we verify your email.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4">
          <h1 className="text-2xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
            Email Verification Failed
          </h1>
          <p className="text-center text-red-500 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
      <div className="flex flex-col w-80 bg-surface-a1 rounded-lg p-4 m-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
          Email Verification Successful
        </h1>
        <p className="text-center mb-4">Your email has now been verified!</p>
        <Link
          to={user ? "/" : "/login"}
          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 py-2 px-4 rounded-lg text-center"
        >
          {user ? "Home" : "Login"}
        </Link>
      </div>
    </div>
  );
}
