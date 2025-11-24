import { useState, useEffect } from "react";
import { getStats } from "../../utils/AuthAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";

export default function OrganizerStats() {
  interface Stats {
    totalUsers: number;
    verifiedEmailUsers: number;
    govSchoolUsers: number;
    studentUsers: number;
    organizerUsers: number;
    judgeUsers: number;
    regularTheme: number;
    spookyTheme: number;
    spaceTheme: number;
    frameworkTheme: number;
    workshops: number;
    totalWorkshopParticipants: number;
    events: number;
    totalEventParticipants: number;
    averageShipRate: number;
    projects: number;
    averageCreativityScore: number;
    averageFunctionalityScore: number;
    averageTechnicalityScore: number;
    averageInterfaceScore: number;
    averageScore: number;
  }
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        console.log("Fetched stats:", data);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
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
    fetchStats();
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
          <p className="text-2xl font-bold">Loading stats...</p>
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center justify-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <div className="bg-surface-a2 p-4 rounded-lg flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">
              An Error Occurred
            </h1>
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center justify-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <div className="bg-surface-a2 p-4 rounded-lg flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">
              No Stats Available?
            </h1>
            <p className="text-lg">
              You shouldn't really be able to get here. Try refreshing, if that
              doesn't work and you keep getting this, please email{" "}
              <a
                href="mailto:nathan@rathacks.com"
                className="text-primary-a0 hover:underline"
              >
                nathan@rathacks.com
              </a>{" "}
              with a description of what you were doing when this happened.
            </p>
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
        <h1 className="text-3xl font-bold text-center mb-4">Stats</h1>
        <div className="bg-surface-a1 p-4 rounded-lg w-full flex flex-col">
          <h2 className="text-xl font-bold">User Stats</h2>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats.totalUsers}
              </span>
              <span className="sm:text-lg md:text-xl">Users</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats.studentUsers}
              </span>
              <span className="sm:text-lg md:text-xl">Students</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats.organizerUsers}
              </span>
              <span className="sm:text-lg md:text-xl">Organizer</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats.judgeUsers}
              </span>
              <span className="sm:text-lg md:text-xl">Judges</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {Math.round(
                  (stats.verifiedEmailUsers / stats.totalUsers) * 100
                )}
                %
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Verified</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {Math.round((stats.govSchoolUsers / stats.totalUsers) * 100)}%
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Gov</span>{" "}
              {/* I shortened Gov School to Gov so I didn't have to change all the sizing just for this one work, if you have a problem with this I'm sorry, but it's not changing */}
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.regularTheme}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Regular</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.spookyTheme}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Spooky</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.spaceTheme}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Space</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.frameworkTheme}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Framework</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-a1 p-4 rounded-lg w-full flex flex-col mt-4">
          <h2 className="text-xl font-bold">Workshop Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-4xl text-primary-a0 font-bold">
                {stats.workshops}
              </span>
              <span className="text-lg">Workshops</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-4xl text-primary-a0 font-bold">
                {stats.totalWorkshopParticipants}
              </span>
              <span className="text-lg">Participants</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-4xl text-primary-a0 font-bold">
                {Math.round(stats.totalWorkshopParticipants / stats.workshops)}
              </span>
              <span className="text-lg">Average</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-a1 p-4 rounded-lg w-full flex flex-col mt-4 mb-4">
          <h2 className="text-xl font-bold">Event Stats</h2>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.events}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Events</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.totalEventParticipants}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Participants
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {Math.round(stats.totalEventParticipants / stats.events)}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Average</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {Math.round(stats.averageShipRate * 100)}%
              </span>
              <span className="text-sm sm:text-base md:text-lg">Ship Rate</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.projects}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Projects</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.averageCreativityScore}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Creativity
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.averageFunctionalityScore}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Functionality
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.averageTechnicalityScore}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Technicality
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.averageInterfaceScore}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Interface</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats.averageScore}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Overall</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
