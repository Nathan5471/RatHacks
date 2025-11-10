import { useState, useEffect } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { organizerGetEmailById, updateEmail } from "../utils/EmailAPIHandler";
import { organizerGetAllEvents } from "../utils/EventAPIHandler";
import { organizerGetAllWorkshops } from "../utils/WorkshopAPIHandler";

export default function EditEmail({
  emailId,
  setReload,
}: {
  emailId: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [messageSubject, setMessageSubject] = useState("");
  const [name, setName] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [subFilterBy, setSubFilterBy] = useState<string | null>(null);
  const [sendAll, setSendAll] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [workshops, setWorkshops] = useState<string[]>([]);

  interface Participants {
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
    events: string[];
    workshops: string[];
    createdAt: string;
  }
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    status: "upcoming" | "ongoing" | "completed";
    participants: Participants[];
    organizer: string;
    organizerId: string;
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
    participants: Participants[];
    teams: Team[];
    createdBy: string;
    createdAt: string;
  }

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const fetchedWorkshops = await organizerGetAllWorkshops();
        setWorkshops(
          fetchedWorkshops.workshops.map((workshop: Workshop) => workshop.name)
        ); // array of strings
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
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await organizerGetAllEvents();
        setEvents(fetchedEvents.events.map((event: Event) => event.name));
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unkown error accured";
        setError(errorMessage);
      }
    };
    fetchEvents();
  }, []);

  const filterMap = new Map();
  filterMap.set("event", "Event");
  filterMap.set("workshop", "Workshop");
  filterMap.set("gradeLevel", "Grade Level");
  filterMap.set("school", "School");

  const subFilterMap = new Map();
  subFilterMap.set("event", events);
  subFilterMap.set("workshop", workshops);
  subFilterMap.set("gradeLevel", [9, 10, 11, 12]);
  subFilterMap.set("school", [
    "Bedford County",
    "Botetourt County",
    "Craig County",
    "Floyd County",
    "Franklin County",
    "Roanoke City",
    "Roanoke County",
    "Salem City",
    "Other",
  ]);

  useEffect(() => {
    const fetchEmailData = async () => {
      setError("");
      try {
        interface EmailData {
          name: string;
          messageSubject: string;
          messageBody: string;
          sendAll: boolean;
          filterBy: string | null;
          subFilterBy: string | null;
          sent: boolean;
        }
        const response = await organizerGetEmailById(emailId);
        const email = response.email as EmailData;
        setName(email.name);
        setMessageSubject(email.messageSubject);
        setMessageBody(email.messageBody);
        setFilterBy(email.filterBy);
        setSubFilterBy(email.subFilterBy);
        setSendAll(email.sendAll);
        setSent(email.sent);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occured";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailData();
  }, [emailId]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateEmail(emailId, {
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
        sent,
      });
      setReload((prev) => !prev);
      closeOverlay();
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-100">
        <h1 className="text-2xl font-bold mb-4">Edit Email</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl font-bold text-center">Edit Email</h1>
      <form className="flex flex-col" onSubmit={handleUpdateEmail}>
        <label htmlFor="name" className="text-2xl mt-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="messageSubject" className="text-2xl mt-2">
          Subject
        </label>
        <input
          type="text"
          id="messageSubject"
          name="messageSubject"
          value={messageSubject}
          onChange={(e) => setMessageSubject(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="messageBody" className="text-2xl mt-2">
          Body
        </label>
        <textarea
          id="messageBody"
          name="messageBody"
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <div className="flex mt-2 w-full gap-2">
          <label htmlFor="sendAll" className="text-2xl text-nowrap">
            Send All?
          </label>
          <input
            type="checkbox"
            id="sendAll"
            name="sendAll"
            className="p-2 rounded-lg text-lg bg-surface-a2"
            onChange={(e) => setSendAll(e.target.checked)}
            checked={sendAll}
          />
        </div>
        {!sendAll && (
          <>
            <label htmlFor="filterBy" className="text-2xl mt-2">
              Filter Receipients By
            </label>
            <select
              name="filterBy"
              id="filterBy"
              className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="">Select a Filter</option>
              <option value="event">Event</option>
              <option value="workshop">Workshop</option>
              <option value="gradeLevel">Grade Level</option>
              <option value="school">School</option>
            </select>
          </>
        )}

        {!sendAll && filterBy && (
          <>
            <label htmlFor="subFilterBy" className="text-2xl mt-2">
              {filterMap.get(filterBy)}?
            </label>
            <select
              name="subFilterBy"
              id="subFilterBy"
              className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
              onChange={(e) => setSubFilterBy(e.target.value)}
            >
              <option value="">Select a {filterMap.get(filterBy)}</option>
              {subFilterMap.get(filterBy).map((catergory: string) => (
                <option value={catergory} key={catergory}>
                  {catergory}
                </option>
              ))}
            </select>
          </>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="w-full flex flex-row mt-4">
          <button
            type="submit"
            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg ml-2 w-full font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
