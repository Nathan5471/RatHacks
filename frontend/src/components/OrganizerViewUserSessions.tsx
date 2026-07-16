import { useState, useEffect } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { getUserSessions } from "../utils/AnalyticsAPIHandler";
import OrganizerViewSession from "../components/OrganizerViewSession";
import axios from "axios";

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
  user: User;
  userId: string;
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

export default function OrganizerViewUserSessions({
  userId,
}: {
  userId: string;
}) {
  const { closeOverlay, openOverlay } = useOverlay();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSessions = async () => {
      try {
        const sessionData = await getUserSessions(userId, controller.signal);
        setSessions(sessionData.sessions);
      } catch (error: unknown) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

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
    fetchSessions();

    return () => {
      controller.abort();
    };
  }, []);

  const handleOpenSession = (session: Session) => {
    openOverlay(<OrganizerViewSession sessionId={session.id} />);
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
    <div className="flex flex-col w-80 sm:w-120 md:w-160">
      {sessions ? (
        <>
          <h1 className="text-2xl font-bold text-center">
            {sessions[0]?.user.firstName || "User"}'s Sessions
          </h1>
          {sessions.length > 0 ? (
            <div className="flex flex-col max-h-60 md:max-h-100 overflow-y-auto mt-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-row p-2 rounded-lg bg-surface-a2 my-2"
                >
                  <div className="flex flex-col">
                    <p className="md:text-lg font-bold">
                      {new Date(session.sessionStart).toLocaleString("en-US", {
                        dateStyle: "full",
                      })}
                      , {new Date(session.sessionStart).toLocaleTimeString()} -
                      {">"} {new Date(session.sessionEnd).toLocaleTimeString()}
                    </p>
                    <p className="text-sm md:text-base">
                      {session.pageViews.length} page views |{" "}
                      {session.operatingSystem || "None"} OS |{" "}
                      {session.browser || "None"} Browser
                    </p>
                  </div>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-auto text-sm sm:text-base font-bold"
                    onClick={() => handleOpenSession(session)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No sessions found.</p>
          )}
          <button
            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full mt-4 font-bold"
            onClick={closeOverlay}
          >
            Close
          </button>
        </>
      ) : (
        <p>Loading session...</p>
      )}
    </div>
  );
}
