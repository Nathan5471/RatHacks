import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resendVerificationEmail } from "../utils/AuthAPIHandler";
import AppNavbar from "../components/AppNavbar";

export default function Dashboard() {
  const { user } = useAuth();
  const [lastRequested, setLastRequested] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (lastRequested === null) return;
    if (lastRequested.getTime() + 15 * 60 * 1000 < new Date().getTime()) {
      setLastRequested(null);
    }
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = lastRequested.getTime() + 15 * 60 * 1000 - now;
      if (distance < 0) {
        setCountdown(0);
        setLastRequested(null);
        clearInterval(timer);
      }
      setCountdown(Math.floor(distance / 1000));
    });
    return () => clearInterval(timer);
  }, [lastRequested]);

  const handleResendVerification = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await resendVerificationEmail();
      setLastRequested(new Date());
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <AppNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col p-4 items-center">
        <h1 className="text-4xl text-center">
          Welcome to your dashboard{" "}
          <span className="font-bold text-primary-a1">{user?.firstName}</span>!
        </h1>
        {!user?.emailVerified && (
          <div className="flex flex-col mt-4 p-4 w-2/3 bg-surface-a1 rounded-lg items-center">
            <h2 className="text-2xl font-bold text-center">
              Your email has{" "}
              <span className="text-3xl text-primary-a0">NOT</span> been
              verified
            </h2>
            <p className="text-center mt-2">
              Please check your inbox for a verification email from
              nathan@rathacks.com. If you do not see it, please check your spam
              folder. If you still don't see it, you can request a new one
              below:
            </p>
            <button
              className={`mt-4 p-2 ${
                lastRequested
                  ? "bg-surface-a2 cursor-not-allowed"
                  : "bg-primary-a0 hover:bg-primary-a1"
              } rounded-lg w-1/3 font-bold`}
              onClick={(e) => handleResendVerification(e)}
            >
              {lastRequested ? countdown : "Resend Verification Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
