import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resendVerificationEmail } from "../utils/AuthAPIHandler";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";

export default function Dashboard() {
  const { user } = useAuth();
  const [lastRequested, setLastRequested] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [navbarOpen, setNavbarOpen] = useState(false);

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
    <div className="relative w-screen h-screen flex flex-col sm:flex-row bg-surface-a0 text-white">
      <div
        className={`${
          navbarOpen ? "absolute inset-0 z-50 block bg-black/50" : "hidden"
        } md:block w-full md:w-1/5 lg:w-1/6 h-full`}
        onClick={() => setNavbarOpen(false)}
      >
        <div
          className="w-1/2 sm:w-1/3 md:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <AppNavbar />
        </div>
      </div>
      <div className="ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto flex flex-col p-4 items-center">
        <button
          className={`absolute top-4 left-4 md:hidden ${
            navbarOpen ? "hidden" : ""
          }`}
          onClick={() => setNavbarOpen(true)}
        >
          <IoMenu className="text-3xl hover:text-4xl" />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
          Welcome to your dashboard{" "}
          <span className="font-bold text-primary-a1">{user?.firstName}</span>!
        </h1>
        {!user?.emailVerified && (
          <div className="flex flex-col mt-4 p-4 w-5/6 lg:w-2/3 bg-surface-a1 rounded-lg items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-center">
              Your email has{" "}
              <span className="text-2xl sm:text-3xl text-primary-a0">NOT</span>{" "}
              been verified
            </h2>
            <p className="text-center mt-2 sm:text-lg">
              Please check your inbox for a verification email from{" "}
              <a
                href="mailto:nathan@rathacks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-a0 hover:underline"
              >
                nathan@rathacks.com
              </a>
              . If you do not see it, please check your spam folder. If you
              still don't see it, you can request a new one below:
            </p>
            <button
              className={`mt-4 p-2 ${
                lastRequested
                  ? "bg-surface-a2 cursor-not-allowed"
                  : "bg-primary-a0 hover:bg-primary-a1"
              } rounded-lg w-5/6 sm:w-2/3 md:w-1/2 lg:w-1/3 font-bold`}
              onClick={(e) => handleResendVerification(e)}
            >
              {lastRequested ? countdown : "Resend Verification Email"}
            </button>
          </div>
        )}
        <div className="flex flex-col mt-6 p-4 w-5/6 lg:w-2/3 bg-surface-a1 rounded-lg items-center">
          <h2 className="text-2xl font-bold text-center">Rat Hacks!</h2>
          <p className="text-center mt-2 text-lg">
            There will be more information about the next Rat Hacks Hackathon
            soon! Check back later for more details.
          </p>
        </div>
      </div>
    </div>
  );
}
