import { useState, useEffect } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { getSession } from "../utils/AnalyticsAPIHandler";
import OrganizerViewUserSessions from "../components/OrganizerViewUserSessions";
import OrganizerViewDeviceSessions from "../components/OrganizerViewDeviceSessions";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  accountType: "student" | "judge" | "organizer";
  theme?: "default" | "spooky" | "space" | "framework";
  firstName: string;
  lastName: string;
  schoolDivision: string;
  gradeLevel: "nine" | "ten" | "eleven" | "twelve" | "organizer" | "judge";
  isGovSchool: boolean;
  techStack: string;
  previousHackathon: boolean;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  contactFirstName: string;
  contactLastName: string;
  contactRelationship: string;
  contactPhoneNumber: string;
  checkedIn?: boolean;
  createdAt: string;
}

interface Session {
  id: string;
  user: User | null;
  userId: string | null;
  pageViews: [
    {
      id: string;
      userId: string | null;
      createdAt: string;
      url: string;
      sessionId: string;
    },
  ];
  sessionLength: number | null;
  sessionStart: string;
  sessionEnd: string;
  operatingSystem: string | null;
  browser: string | null;
  deviceType: string | null;
  deviceId: string;
  ip: string | null;
}

export default function OrganizerViewSession({
  sessionId,
}: {
  sessionId: string;
}) {
  const { closeOverlay, openOverlay } = useOverlay();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession(sessionId);
        setSession(sessionData.session);
      } catch (error: unknown) {
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
    fetchSession();
  }, []);

  const handleOpenUserSessions = () => {
    if (!session?.user) return;

    openOverlay(<OrganizerViewUserSessions userId={session.user.id} />);
  };

  const handleOpenDeviceSessions = () => {
    if (!session) return;
    openOverlay(<OrganizerViewDeviceSessions deviceId={session.deviceId} />);
  };

  if (error) {
    return (
      <div className="flex flex-col w-80 sm:w-100">
        <p className="text-red-500">Error loading session: {error}</p>
        <button
          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
          onClick={closeOverlay}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-120 sm:w-160">
      {session ? (
        <>
          <h1 className="text-2xl font-bold text-center">
            {new Date(session.sessionStart).toLocaleDateString("en-US", {
              dateStyle: "full",
            }) +
              " - " +
              new Date(session.sessionStart).toLocaleTimeString()}
          </h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <p className="text-lg">
              <span className="font-bold">User: </span>
              {session.user
                ? session.user.firstName + " " + session.user.lastName
                : "None"}
            </p>
            <p className="text-lg">
              <span className="font-bold">OS: </span>
              {session.operatingSystem || "None"}
            </p>
            <p className="text-lg">
              <span className="font-bold">Browser: </span>
              {session.browser || "None"}
            </p>
            <p className="text-lg">
              <span className="font-bold">Device Type: </span>
              {session.deviceType || "None"}
            </p>
          </div>
          <h3 className="text-lg mt-4 font-bold">Page Views</h3>
          <div className="flex flex-col max-h-100 overflow-y-scroll bg-surface-a2 p-2 rounded-lg">
            {session.pageViews?.map((view, index) => (
              <div key={view.id} className="flex text-lg w-full">
                {index + 1}) {view.url}{" "}
                <span className="text-right ml-auto">
                  {new Date(view.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-2 mt-4">
            {session.user && (
              <button
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
                onClick={handleOpenUserSessions}
              >
                View User Sessions
              </button>
            )}
            <button
              className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
              onClick={handleOpenDeviceSessions}
            >
              View Device Sessions
            </button>
            <button
              className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-full font-bold"
              onClick={closeOverlay}
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <p>Loading session...</p>
      )}
    </div>
  );
}
