import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetAllWorkshops } from "../../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import OrganizerNavbar from "../../components/OrganizerNavbar";

export default function OrganizerWorkshops() {
  const { openOverlay } = useOverlay();
  const [reload, setReload] = useState(false);
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
    createdAt: string;
  }
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    participants: Participants[];
    organizer: string;
    organizerId: string;
    createdAt: string;
  }
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const fetchedWorkshops = await organizerGetAllWorkshops();
        setWorkshops(fetchedWorkshops.workshops as Workshop[]);
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
    fetchWorkshops();
  }, [reload]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center">
          <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
            <div />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-4xl font-bold">Workshops</h1>
            </div>
            <div className="flex items-center">
              <button className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1">
                Create Workshop
              </button>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center">
          <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
            <div />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-4xl font-bold">Workshops</h1>
            </div>
            <div className="flex items-center">
              <button className="ml-auto p-2 rounded-lg text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1">
                Create Workshop
              </button>
            </div>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-4xl text-center">
                An error occured while fetching the workshops:
              </h2>
              <p className="text-2xl text-red-500 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col items-center">
        <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
          <div />
          <div className="flex items-center justify-center text-center">
            <h1 className="text-4xl font-bold">Workshops</h1>
          </div>
          <div className="flex items-center">
            <button className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1">
              Create Workshop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
