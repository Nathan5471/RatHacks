import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetEventById } from "../../utils/EventAPIHandler";
import { formatDate } from "date-fns";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditEvent from "../../components/EditEvent";
import DeleteEvent from "../../components/DeleteEvent";
import OrganizerUserView from "../../components/OrganizerUserView";

export default function OrganizerEvent() {
  const { openOverlay } = useOverlay();
  const { eventId } = useParams<{ eventId: string }>();
  const [reload, setReload] = useState(false);
  interface Participant {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
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
    createdAt: string;
  }
  interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    participants: Participant[];
    createdBy: string;
    createdAt: string;
  }
  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    organizer: "Organizer",
    judge: "Judge",
  };
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [hideCountdown, setHideCountdown] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventId) {
          const response = await organizerGetEventById(eventId);
          setEvent(response.event);
        }
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, reload]);

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
  });

  const handleOpenEditEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (eventId) {
      openOverlay(<EditEvent eventId={eventId} setReload={setReload} />);
    }
  };

  const handleOpenDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (eventId && event) {
      openOverlay(
        <DeleteEvent
          eventId={eventId}
          eventName={event.name}
          currentPage="event"
          setReload={undefined}
        />
      );
    }
  };

  const handleOpenOrganizerUserView = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    if (eventId && event) {
      openOverlay(<OrganizerUserView user={event.participants[index]} />);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
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
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col items-center overflow-y-auto">
        {event ? (
          <div className="mx-16 mt-5 flex flex-col mb-2">
            <h1 className="text-4xl font-bold text-center mb-4">
              {event.name}
            </h1>
            <div className="flex flex-row bg-surface-a1 p-4 rounded-lg mb-4">
              <div className="flex flex-col w-2/3">
                <p className="text-lg mb-2">{event.description}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/organizer/events"
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Events
                  </Link>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={handleOpenEditEvent}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={handleOpenDeleteEvent}
                  >
                    Delete
                  </button>
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
                  {event.participants.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                Scary Countdown for {event.name} (
                <span
                  className="font-normal text-primary-a0 hover:underline cursor-pointer"
                  onClick={() => setHideCountdown(!hideCountdown)}
                >
                  {hideCountdown ? "Show" : "Hide"}
                </span>
                )
              </h2>
              {!hideCountdown && (
                <div className="flex flex-row justify-center">
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
              )}
            </div>
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                Registered Participants
              </h2>
              {event.participants.length > 0 ? (
                <table className="min-w-full bg-surface-a2 rounded-lg overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Email
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Email Verified
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Account Type
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        School Division
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Grade Level
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Is RVGS
                      </th>
                      <th className="py-2 px-4 border-b border-surface-a1 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.participants.map((participant, index) => (
                      <tr key={participant.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.firstName} {participant.lastName}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.email}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.emailVerified ? "Yes" : "No"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.accountType}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.schoolDivision}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {gradeMap[participant.gradeLevel]}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.isGovSchool ? "Yes" : "No"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={(e) =>
                              handleOpenOrganizerUserView(e, index)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No participants registered yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Event not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/events"
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
