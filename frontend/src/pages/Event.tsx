import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById, joinEvent, leaveEvent } from "../utils/EventAPIHandler";
import { useAuth } from "../contexts/AuthContext";
import { formatDate } from "date-fns";
import AppNavbar from "../components/AppNavbar";

export default function Event() {
  const { eventId } = useParams<{ eventId: string }>();
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
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventId) {
          const response = await getEventById(eventId);
          setEvent(response.event);
        }
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!event) return null;
      const now = new Date();
      const eventDate = new Date(event.startDate);
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) return null;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    const updateTimeRemaining = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(updateTimeRemaining);
  }, [event]);

  const handleJoin = async () => {
    if (!eventId) return;
    try {
      await joinEvent(eventId);
      await getUser();
    } catch (error) {
      console.error("Error joinging event:", error);
    }
  };

  const handleLeave = async () => {
    if (!eventId) return;
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
        <div className="w-5/6 h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl">Loading...</h1>
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
        {event ? (
          <div className="mx-16 mt-6 flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-4">
              {event.name}
            </h1>
            <div className="flex flex-row bg-surface-a1 p-4 rounded-lg">
              <div className="flex flex-col w-2/3">
                <p className="text-lg mb-2">{event.description}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/events"
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Events
                  </Link>
                  {user && user.events.includes(event.id) ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={handleLeave}
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      className="bg-primary-a0 hover:bg-primary-a1 p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={handleJoin}
                    >
                      Join Event
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-1/3 ml-2">
                <span className="font-bold">Location:</span> {event.location}
                <span className="font-bold">Start Date:</span>{" "}
                {formatDate(event.startDate, "EEEE, MMMM d yyyy h:mm a")}
                <span className="font-bold">End Date:</span>{" "}
                {formatDate(event.endDate, "EEEE, MMMM d yyy h:mm a")}
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
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                {event.name} Countdown
              </h2>
              <div className="flex flex-row w-full justify-center">
                <div className="flex flex-col bg-surface-a2 rounded-lg w-30 p-4 mx-2">
                  <span className="text-5xl font-bold text-primary-a0 text-center">
                    {timeRemaining?.days || 0}
                  </span>
                  <span className="text-xl text-center">Days</span>
                </div>
                <div className="flex flex-col bg-surface-a2 rounded-lg w-30 p-4 mx-2">
                  <span className="text-5xl font-bold text-primary-a0 text-center">
                    {timeRemaining?.hours || 0}
                  </span>
                  <span className="text-xl text-center">Hours</span>
                </div>
                <div className="flex flex-col bg-surface-a2 rounded-lg w-30 p-4 mx-2">
                  <span className="text-5xl font-bold text-primary-a0 text-center">
                    {timeRemaining?.minutes || 0}
                  </span>
                  <span className="text-xl text-center">Minutes</span>
                </div>
                <div className="flex flex-col bg-surface-a2 rounded-lg w-30 p-4 mx-2">
                  <span className="text-5xl font-bold text-primary-a0 text-center">
                    {timeRemaining?.seconds || 0}
                  </span>
                  <span className="text-xl text-center">Seconds</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-2/3 flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Event not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/events"
                className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg"
              >
                Back to Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
