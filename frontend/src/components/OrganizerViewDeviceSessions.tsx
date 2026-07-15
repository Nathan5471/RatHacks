import { useState, useEffect } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { getDeviceSessions } from "../utils/AnalyticsAPIHandler";
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

export default function OrganizerViewDeviceSessions({
  deviceId,
}: {
  deviceId: string;
}) {
  const { closeOverlay, openOverlay } = useOverlay();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSessions = async () => {
      try {
        const sessionData = await getDeviceSessions(
          deviceId,
          controller.signal,
        );
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
    <div className="flex flex-col w-120 sm:w-160">
      {sessions ? (
        <>
          <h1 className="text-2xl font-bold text-center">Device Sessions</h1>
          <p className="text-lg text-center">
            {sessions[0]?.operatingSystem || "Unknown OS"} |{" "}
            {sessions[0]?.browser || "Unknown Browser"} |{" "}
            {sessions[0]?.deviceType || "Unknown Device"}
          </p>
          {sessions.length > 0 ? (
            <div className="flex flex-col max-h-100 overflow-y-auto mt-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-row p-2 rounded-lg bg-surface-a2 my-2"
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      {new Date(session.sessionStart).toLocaleString("en-US", {
                        dateStyle: "full",
                      })}
                      , {new Date(session.sessionStart).toLocaleTimeString()} -
                      {">"} {new Date(session.sessionEnd).toLocaleTimeString()}
                    </p>
                    <p>
                      {session.pageViews.length} page views |{" "}
                      {session.user
                        ? session.user.firstName + " " + session.user.lastName
                        : "No User"}
                    </p>
                  </div>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-auto font-bold"
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
