import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { judgeGetAllEvents } from "../../utils/EventAPIHandler";
import JudgeNavbar from "../../components/JudgeNavbar";
import { formatDate } from "date-fns";
import LinkDetectedText from "../../components/LinkDetectedText";

export default function JudgeEvents() {
  interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    status: "upcoming" | "ongoing" | "completed";
    releasedJuding: boolean;
    participantCount: number;
    projectCount: number;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await judgeGetAllEvents();
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
            <JudgeNavbar />
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Events</h1>
          <p className="text-lg mt-8">Loading events...</p>
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
          <JudgeNavbar />
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Events</h1>
        {events.length === 0 ? (
          <p className="text-2xl mt-8">No event that need judging</p>
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
                  <Link
                    to={`/app/judge/event/${event.id}`}
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full mt-2 sm:mt-auto"
                  >
                    View Event
                  </Link>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 sm:ml-2">
                  <p>
                    <span className="font-bold">Status:</span> {event.status}
                  </p>
                  <span className="font-bold">Location:</span> {event.location}
                  <span className="font-bold">Start Date:</span>{" "}
                  {formatDate(event.startDate, "EEEE, MMMM d yyyy, h:mm a")}
                  <span className="font-bold">End Date:</span>{" "}
                  {formatDate(event.endDate, "EEEE, MMMM d yyyy, h:mm a")}
                  <span className="font-bold">Submission Deadline:</span>{" "}
                  {formatDate(
                    event.submissionDeadline,
                    "EEEE, MMMM d yyyy, h:mm a"
                  )}
                  <p>
                    <span className="font-bold">Participants:</span>{" "}
                    {event.participantCount}
                  </p>
                  <p>
                    <span className="font-bold">Projects:</span>{" "}
                    {event.projectCount}
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
