import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetAllEvents } from "../../utils/EventAPIHandler";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import CreateEvent from "../../components/CreateEvent";
import EditEvent from "../../components/EditEvent";
import DeleteEvent from "../../components/DeleteEvent";
import LinkDetectedText from "../../components/LinkDetectedText";

export default function OrganizerEvents() {
  const { openOverlay } = useOverlay();
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
    contactFirstName: string;
    contactLastName: string;
    contactRelationship: string;
    contactPhoneNumber: string;
    createdAt: string;
  }
  interface Team {
    id: string;
    joinCode: string;
    members: string[];
    eventId: string;
    submittedProject: boolean;
    project: string | null;
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
    status: "upcoming" | "ongoing" | "completed";
    participants: Participant[];
    checkedInParticipants: number;
    teams: Team[];
    createdBy: string;
    createdAt: string;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await organizerGetAllEvents();
        setEvents(fetchedEvents.events as Event[]);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unkown error accured";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [reload]);

  const handleOpenCreateEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<CreateEvent />);
  };

  const handleOpenEditEvent = (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string
  ) => {
    e.preventDefault();
    openOverlay(<EditEvent eventId={eventId} setReload={setReload} />);
  };

  const handleOpenDeleteEvent = (
    e: React.MouseEvent<HTMLButtonElement>,
    eventId: string,
    eventName: string
  ) => {
    e.preventDefault();
    openOverlay(
      <DeleteEvent
        eventId={eventId}
        eventName={eventName}
        currentPage="events"
        setReload={setReload}
      />
    );
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
            <OrganizerNavbar />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Events
              </h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateEvent}
              >
                Add Event
              </button>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading events...</p>
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
            <OrganizerNavbar />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Events
              </h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateEvent}
              >
                Add Event
              </button>
            </div>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-center">
                An error occured while fetching the events:
              </h2>
              <p className="text-xl sm:text-2xl text-red-500 mt-2">{error}</p>
            </div>
          </div>
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
          <OrganizerNavbar />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
          <div className="hidden sm:block" />
          <div className="flex items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Events
            </h1>
          </div>
          <div className="flex items-center">
            <button
              className="ml-auto p-2 rounded-lg sm:text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleOpenCreateEvent}
            >
              Add Event
            </button>
          </div>
        </div>
        {events.length === 0 ? (
          <p className="text-2xl mt-8">No events yet</p>
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
                      to={`/app/organizer/event/${event.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    <button
                      className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={(e) => handleOpenEditEvent(e, event.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={(e) =>
                        handleOpenDeleteEvent(e, event.id, event.name)
                      }
                    >
                      Delete
                    </button>
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
                    {event.participants.length}
                  </p>
                  <p>
                    <span className="font-bold">Checked In Participants:</span>{" "}
                    {event.checkedInParticipants}
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
