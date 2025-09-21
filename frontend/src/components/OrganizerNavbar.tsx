import { Link, useLocation } from "react-router-dom";

export default function OrganizerNavbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="w-full h-screen flex flex-col bg-surface-a1">
      <h1 className="text-3xl font-bold text-center">Organizer</h1>
      <hr className="border-t-3 mx-2" />
      <Link
        to="/app/organizer"
        className={`p-3 mt-4 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/organizer" ? "text-primary-a1" : "text-white"
        } bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1`}
      >
        Dashboard
      </Link>
      <Link
        to="/app/organizer/events"
        className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/organizer/events" ? "text-primary-a1" : "text-white"
        } bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1`}
      >
        Events
      </Link>
      <Link
        to="/app"
        className="mt-auto p-3 m-2 rounded-lg text-xl text-center font-bold text-white bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1"
      >
        Back to app
      </Link>
    </div>
  );
}
