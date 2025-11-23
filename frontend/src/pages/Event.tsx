import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getEventById,
  joinEvent,
  leaveEvent,
  joinTeam,
  leaveTeam,
} from "../utils/EventAPIHandler";
import { useAuth } from "../contexts/AuthContext";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";
import LinkDetectedText from "../components/LinkDetectedText";

export default function Event() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, getUser } = useAuth();
  interface Team {
    id: string;
    joinCode: string;
    members: string[];
    submittedProject: boolean;
    project: string | null;
  }
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
    team: Team | null;
  }
  const [event, setEvent] = useState<Event | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [newTeamJoinCode, setNewTeamJoinCode] = useState("");
  const [teamError, setTeamError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

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
  }, [eventId, refresh]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!event || event.status === "completed") return null;
      const now = new Date();
      const eventStartDate = new Date(event.startDate);
      const eventSubmissionDeadline = new Date(event.submissionDeadline);
      let difference = 0;
      if (event.status === "upcoming") {
        difference = eventStartDate.getTime() - now.getTime();
      } else if (event.status === "ongoing") {
        difference = eventSubmissionDeadline.getTime() - now.getTime();
      }

      if (difference <= 0) {
        setRefresh(!refresh);
        return null;
      }

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
  }, [event, refresh]);

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!eventId) return;
    try {
      await joinEvent(eventId);
      await getUser();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleLeave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!eventId) return;
    try {
      await leaveEvent(eventId);
      await getUser();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !newTeamJoinCode) return;
    try {
      await joinTeam(eventId, newTeamJoinCode);
      setNewTeamJoinCode("");
      setTeamError("");
      setRefresh(!refresh);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setTeamError(errorMessage);
    }
  };

  const handleLeaveTeam = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!eventId) return;
    try {
      await leaveTeam(eventId);
      setRefresh(!refresh);
    } catch (error) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setTeamError(errorMessage);
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-4xl">Loading...</h1>
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
        {event ? (
          <div className="w-full sm:w-5/6 flex flex-col mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              {event.name}
            </h1>
            <div className="flex flex-col sm:flex-row bg-surface-a1 p-4 rounded-lg">
              <div className="flex flex-col w-full sm:w-2/3">
                <LinkDetectedText
                  className="text-lg mb-2"
                  text={event.description}
                />
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/events"
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Events
                  </Link>
                  {event.status === "upcoming" &&
                    (user && user.events.includes(event.id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                        onClick={handleLeave}
                      >
                        Leave Event
                      </button>
                    ) : (
                      <button
                        className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                        onClick={handleJoin}
                      >
                        Join Event
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
            {event.status !== "completed" && (
              <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
                {event.status === "upcoming" && (
                  <h2 className="text-2xl font-bold text-center mb-2">
                    {event.name} Countdown
                  </h2>
                )}
                {event.status === "ongoing" && (
                  <h2 className="text-2xl font-bold text-center mb-2">
                    Time Remaining to Submit Projects
                  </h2>
                )}
                <div className="flex flex-row w-full justify-center">
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-2 sm:p-4 mx-2">
                    <span className="text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.days || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">Days</span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-2 sm:p-4 mx-2">
                    <span className="text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.hours || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Hours
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-2 sm:p-4 mx-2">
                    <span className="text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.minutes || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Minutes
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-2 sm:p-4 mx-2">
                    <span className="text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.seconds || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Seconds
                    </span>
                  </div>
                </div>
              </div>
            )}
            {user?.events.includes(event.id) &&
              event.team &&
              event.status !== "completed" && (
                <div className="flex flex-col sm:flex-row mt-4">
                  <div className="flex flex-col bg-surface-a1 p-4 rounded-lg w-full sm:w-2/3 items-center">
                    <h2 className="text-2xl font-bold text-center mb-2">
                      Project Submission
                    </h2>
                    <p className="text-lg text-center">
                      To submit your project you will need a title, description,
                      a link to your code, a screenshot, a video of your
                      project, and optionally you can include a demo URL. The
                      video should show off all of your project. I highly
                      reccomend talking during your video because it makes them
                      much more fun to watch. If you want help deploy your
                      project, talk to an organizer!
                    </p>
                    <Link
                      to={`/app/event/submit/${event.id}`}
                      className={`w-2/3 sm:w-1/2 ${
                        event.status === "ongoing" &&
                        new Date().getTime() <=
                          new Date(event.submissionDeadline).getTime() &&
                        !event.team.submittedProject
                          ? "bg-primary-a0 hover:bg-primary-a1"
                          : "bg-surface-a2 cursor-not-allowed"
                      } mt-4 rounded-lg p-2 font-bold text-center`}
                      onClick={(e) => {
                        if (
                          !(
                            event.status === "ongoing" &&
                            new Date().getTime() <=
                              new Date(event.submissionDeadline).getTime() &&
                            !event.team?.submittedProject
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {event.status === "upcoming" && "Submitting Not Open Yet"}
                      {event.status === "ongoing" &&
                        new Date().getTime() <=
                          new Date(event.submissionDeadline).getTime() &&
                        !event.team.submittedProject &&
                        "Submit Project"}
                      {event.status === "ongoing" &&
                        new Date().getTime() <=
                          new Date(event.submissionDeadline).getTime() &&
                        event.team.submittedProject &&
                        "Project Submitted!"}
                      {event.status === "ongoing" &&
                        new Date(event.submissionDeadline).getTime() <=
                          new Date().getTime() &&
                        "Submission Deadline Passed"}
                    </Link>
                  </div>
                  <div className="flex flex-col bg-surface-a1 p-4 rounded-lg w-full mt-2 sm:mt-0 sm:w-1/3 sm:ml-2">
                    <h2 className="text-2xl font-bold text-center mb-2">
                      Your Team
                    </h2>
                    <p className="text-lg">Join Code: {event.team.joinCode}</p>
                    <p className="text-lg">Members</p>
                    <ul className="list-disc list-inside">
                      {event.team.members.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                    {!event.team.submittedProject && (
                      <form
                        className="flex flex-col mt-4"
                        onSubmit={handleJoinTeam}
                      >
                        <label htmlFor="joinCode" className="text-lg mt-2">
                          Join Code:
                        </label>
                        <input
                          type="text"
                          id="joinCode"
                          name="joinCode"
                          value={newTeamJoinCode}
                          onChange={(e) => setNewTeamJoinCode(e.target.value)}
                          className="p-2 rounded-lg bg-surface-a2"
                          placeholder="Enter join code"
                          required
                        />
                        {teamError && (
                          <p className="text-red-500 mt-2">{teamError}</p>
                        )}
                        <div className="flex flex-row">
                          <button
                            type="submit"
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold mt-2 w-full"
                          >
                            Join Team
                          </button>
                          <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg font-bold mt-2 ml-2 w-full"
                            onClick={handleLeaveTeam}
                          >
                            Leave Team
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="w-2/3 flex flex-col">
            <h1 className="text-4xl text-center font-bold mb-4">
              Event not found
            </h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/events"
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-white"
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
