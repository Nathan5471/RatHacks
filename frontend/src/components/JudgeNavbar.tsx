import { Link, useLocation } from "react-router-dom";

export default function JudgeNavbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="w-full h-screen flex flex-col bg-surface-a1">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Judge</h1>
      <hr className="border-t-2 sm:border-t-3 mx-2" />
      <Link
        to="/app/judge"
        className={`p-2 sm:p-3 mt-2 md:mt-4 mx-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/judge" ? "text-primary-a0" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Dashboard
      </Link>
      <Link
        to="/app/judge/events"
        className={`p-2 sm:p-3 mx-2 mt-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/judge/events" ? "text-primary-a0" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Events
      </Link>
      <Link
        to="/app"
        className="mt-auto p-2 sm:p-3 m-2 rounded-lg text-xl text-center font-bold bg-surface-a2 hover:bg-surface-a3"
      >
        Back to app
      </Link>
    </div>
  );
}
