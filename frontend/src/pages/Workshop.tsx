import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getWorkshopById,
  joinWorkshop,
  leaveWorkshop,
} from "../utils/WorkshopAPIHandler";
import { useAuth } from "../contexts/AuthContext";
import { formatDate } from "date-fns";
import AppNavbar from "../components/AppNavbar";

export default function Workshop() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const { user, getUser } = useAuth();
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    participantCount: number;
    organizer: string;
  }
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        if (workshopId) {
          const response = await getWorkshopById(workshopId);
          setWorkshop(response.workshop);
        }
      } catch (error: unknown) {
        console.error("Error fetching workshop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [workshopId]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!workshop) return null;
      const now = new Date();
      const workshopDate = new Date(workshop.startDate);
      const difference = workshopDate.getTime() - now.getTime();

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

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!workshopId) return;
    try {
      await joinWorkshop(workshopId);
      await getUser();
    } catch (error) {
      console.error("Error joining workshop:", error);
    }
  };

  const handleLeave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!workshopId) return;
    try {
      await leaveWorkshop(workshopId);
      await getUser();
    } catch (error) {
      console.error("Error leaving workshop:", error);
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
      <div className="w-5/6 h-full flex flex-col items-center overflow-y-auto">
        {workshop ? (
          <div className="w-5/6 mt-5 flex flex-col mb-2">
            <h1 className="text-4xl font-bold text-center mb-4">
              {workshop.name}
            </h1>
            <div className="flex flex-row bg-surface-a1 p-4 rounded-lg">
              <div className="flex flex-col w-2/3">
                <p className="text-lg mb-2">{workshop.description}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/workshops"
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Workshops
                  </Link>
                  {user && user.workshops.includes(workshop.id) ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={handleLeave}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="bg-primary-a0 hover:bg-primary-a1 p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={handleJoin}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-1/3 ml-2">
                <span className="font-bold">Start Date:</span>{" "}
                {formatDate(workshop.startDate, "EEEE, MMMM d yyyy h:mm a")}
                <span className="font-bold">End Date:</span>{" "}
                {formatDate(workshop.endDate, "EEEE, MMMM d yyyy h:mm a")}
                <p>
                  <span className="font-bold">Participants:</span>{" "}
                  {workshop.participantCount}
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
              </div>
            )}
          </div>
        ) : (
          <div className="w-2/3 flex flex-col">
            <h1 className="text-4xl text-center font-bold mb-4">
              Workshop not found
            </h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/workshops"
                className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg"
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
