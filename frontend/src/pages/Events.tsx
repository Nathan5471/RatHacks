import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllEvents, joinEvent, leaveEvent } from "../utils/EventAPIHandler";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";
import LinkDetectedText from "../components/LinkDetectedText";

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
    status: "upcoming" | "ongoing" | "completed";
    participantCount: number;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

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

  const handleJoin = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string
  ) => {
    e.preventDefault();
    try {
      await joinEvent(eventId);
      await getUser();
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleLeave = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string
  ) => {
    e.preventDefault();
    try {
      await leaveEvent(eventId);
      await getUser();
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  if (loading) {
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-3xl sm:text-4xl text-center">Events</h1>
          <p className="mt-4 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-3xl sm:text-4xl text-center">Events</h1>
          <p className="mt-4 text-lg text-red-500 w-3/4 text-center">
            There was an error loading events, please try refreshing: {error}
          </p>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
        <button
          className={`absolute top-4 left-4 md:hidden ${
            navbarOpen ? "hidden" : ""
          }`}
          onClick={() => setNavbarOpen(true)}
        >
          <IoMenu className="text-3xl hover:text-4xl" />
        </button>
        <h1 className="text-3xl sm:text-4xl text-center font-bold">Events</h1>
        {events.length === 0 ? (
          <p className="mt-4 text-lg">No events available.</p>
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row bg-surface-a1 w-full sm:w-5/6 mt-2 mb-4 p-4 rounded-lg"
              >
                <div className="flex flex-col w-full sm:w-2/3">
                  <h2 className="text-3xl font-bold">{event.name}</h2>
                  <LinkDetectedText
                    className="text-lg mb-2"
                    text={event.description}
                  />
                  <div className="flex flex-row w-full mt-auto">
                    <Link
                      to={`/app/event/${event.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    {event.status === "upcoming" &&
                      (user && user.events.includes(event.id) ? (
                        <button
                          onClick={(e) => handleLeave(e, event.id)}
                          className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleJoin(e, event.id)}
                          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 ml-2 rounded-lg font-bold w-full"
                        >
                          Join
                        </button>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 sm:ml-2">
                  <p>
                    <span className="font-bold">Status:</span> {event.status}
                  </p>
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
