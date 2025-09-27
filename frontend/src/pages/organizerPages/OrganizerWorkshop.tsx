import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import {
  organizerGetWorkshopById,
  addGoogleMeetURL,
} from "../../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditWorkshop from "../../components/EditWorkshop";
import DeleteWorkshop from "../../components/DeleteWorkshop";
import OrganizerUserView from "../../components/OrganizerUserView";

export default function OrganizerWorkshop() {
  const { openOverlay } = useOverlay();
  const { workshopId } = useParams<{ workshopId: string }>();
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
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    participants: Participant[];
    organizer: string;
    organizerId: string;
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
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [googleMeetURL, setGoogleMeetURL] = useState("");
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
        if (workshopId) {
          const response = await organizerGetWorkshopById(workshopId);
          setWorkshop(response.workshop);
        }
      } catch (error: unknown) {
        console.error("Error fetching workshop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [workshopId, reload]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!workshop) return null;
      if (workshop.googleMeetURL) return null;
      const now = new Date();
      const startDate = new Date(workshop.startDate);
      const difference = startDate.getTime() - now.getTime();

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
  }, [workshop]);

  const handleOpenEditEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (workshopId) {
      openOverlay(
        <EditWorkshop workshopId={workshopId} setReload={setReload} />
      );
    }
  };

  const handleOpenDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (workshopId && workshop) {
      openOverlay(
        <DeleteWorkshop
          workshopId={workshopId}
          workshopName={workshop.name}
          currentPage="workshop"
          setReload={undefined}
        />
      );
    }
  };

  const handleAddGoogleMeetURL = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!workshopId) return;
    try {
      await addGoogleMeetURL(workshopId, googleMeetURL);
      setGoogleMeetURL("");
      setReload(!reload);
    } catch (error) {
      console.error("Error adding Google Meet URL:", error);
    }
  };

  const handleOpenUserView = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    if (workshopId && workshop) {
      openOverlay(<OrganizerUserView user={workshop?.participants[index]} />);
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
        {workshop ? (
          <div className="mx-16 mt-5 flex flex-col mb-2">
            <h1 className="text-4xl font-bold text-center mb-4">
              {workshop.name}
            </h1>
            <div className="flex flex-row bg-surface-a1 p-4 rounded-lg">
              <div className="flex flex-col w-2/3">
                <p className="text-lg mb-2">{workshop.description}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/organizer/workshops"
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Workshops
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
                <span className="font-bold">Start Date:</span>{" "}
                {formatDate(workshop.startDate, "EEEE, MMMM d yyyy h:mm a")}
                <span className="font-bold">End Date:</span>{" "}
                {formatDate(workshop.endDate, "EEEE, MMMM d yyyy h:mm a")}
                <p>
                  <span className="font-bold">Participants:</span>{" "}
                  {workshop.participants.length}
                </p>
                <p>
                  <span className="font-bold">Organizer:</span>{" "}
                  {workshop.organizer}
                </p>
              </div>
            </div>
            {workshop.googleMeetURL ? (
              <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-2">
                  Workshop is live! Join now:
                </h2>
                <a
                  href={workshop.googleMeetURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-a0 text-center text-lg hover:underline break-all"
                >
                  {workshop.googleMeetURL}
                </a>
              </div>
            ) : (
              <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-2">
                  {workshop.name} Countdown
                </h2>
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
                <form onSubmit={handleAddGoogleMeetURL} className="mt-4">
                  <label htmlFor="googleMeetURL" className="font-bold">
                    Google Meet URL:
                  </label>
                  <div className="flex flex-row mt-2">
                    <input
                      type="url"
                      id="googleMeetURL"
                      name="googleMeetURL"
                      value={googleMeetURL}
                      onChange={(e) => setGoogleMeetURL(e.target.value)}
                      placeholder="Enter Google Meet URL"
                      className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-primary-a0 hover:bg-primary-a1 px-8 py-2 ml-2 rounded-lg font-bold"
                    >
                      Start
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                Registered Participants ({workshop.participants.length})
              </h2>
              {workshop.participants.length > 0 ? (
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
                    {workshop.participants.map((participant, index) => (
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
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={(e) => handleOpenUserView(e, index)}
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
            <h1 className="text-4xl font-bold mb-4">Workshop not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/workshops"
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
              >
                Back to Workshops
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
