import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllEvents, joinEvent, leaveEvent } from "../utils/EventAPIHandler";
import { formatDate } from "date-fns";
import AppNavbar from "../components/AppNavbar";

export default function Events() {
  const { user, getUser } = useAuth();
  interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    participantCount: number;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setError("");
      try {
        const response = await getAllEvents();
        setEvents(response.events);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleJoin = async (eventId: string) => {
    try {
      await joinEvent(eventId);
      await getUser();
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleLeave = async (eventId: string) => {
    try {
      await leaveEvent(eventId);
      await getUser();
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <AppNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col p-4 items-center">
          <h1 className="text-4xl text-center">Events</h1>
          <p className="mt-4 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <AppNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col p-4 items-center">
          <h1 className="text-4xl text-center">Events</h1>
          <p className="mt-4 text-lg text-red-500 w-3/4 text-center">
            There was an error loading events, please try refreshing: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <AppNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col p-4 items-center overflow-y-auto">
        <h1 className="text-4xl text-center">Events</h1>
        {events.length === 0 ? (
          <p className="mt-4 text-lg">No events available.</p>
        ) : (
          <div className="w-full h-full flex flex-col">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-row bg-surface-a1 mx-16 mt-6 p-4 rounded-lg"
              >
                <div className="flex flex-col w-2/3">
                  <h2 className="text-3xl">{event.name}</h2>
                  <p>{event.description}</p>
                  <div className="flex flex-row w-full mt-auto">
                    <Link
                      to={`/app/event/${event.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    {user && user.events.includes(event.id) ? (
                      <button
                        onClick={() => handleLeave(event.id)}
                        className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(event.id)}
                        className="bg-primary-a0 hover:bg-primary-a1 p-2 ml-2 rounded-lg font-bold w-full"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-1/3 ml-2">
                  <span className="font-bold">Location:</span> {event.location}
                  <span className="font-bold">Start Date:</span>{" "}
                  {formatDate(event.startDate, "EEEE, MMMM d yyyy h:mm a")}
                  <span className="font-bold">End Date:</span>{" "}
                  {formatDate(event.endDate, "EEEE, MMMM d yyyy h:mm a")}
                  <span className="font-bold">Submission Deadline:</span>{" "}
                  {formatDate(
                    event.submissionDeadline,
                    "EEEE, MMMM d yyyy h:mm a"
                  )}
                  <p>
                    <span className="font-bold">Participants:</span>{" "}
                    {event.participantCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
