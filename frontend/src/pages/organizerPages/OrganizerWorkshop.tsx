import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetWorkshopById } from "../../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditWorkshop from "../../components/EditWorkshop";
import DeleteWorkshop from "../../components/DeleteWorkshop";

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
  const [loading, setLoading] = useState(true);

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
            <div className="flex flex-row bg-surface-a1 p-4 rounded-lg mb-4">
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
