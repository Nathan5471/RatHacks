import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  inviteOrganizer,
  inviteJudge,
  getInvites,
} from "../../utils/AuthAPIHandler";
import { getStats } from "../../utils/AuthAPIHandler";
import { useOverlay } from "../../contexts/OverlayContext";
import { formatDate } from "date-fns";
import { IoMenu, IoTrash } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import CancelInvite from "../../components/CancelInvite";
import axios from "axios";

interface Stats {
  totalUsers: number;
  verifiedEmailUsers: number;
  govSchoolUsers: number;
  studentUsers: number;
  organizerUsers: number;
  formerOrganizerUsers: number;
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

interface Invite {
  email: string;
  role: "organizer" | "judge";
  expires: string;
}

export default function OrganizerDashboard() {
  const { openOverlay } = useOverlay();
  const [inviteOrganizerEmail, setInviteOrganizerEmail] = useState("");
  const [inviteOrganizerError, setInviteOrganizerError] = useState("");
  const [outgoingOrganizerInvites, setOutgoingOrganizerInvites] = useState<
    Invite[]
  >([]);
  const [inviteJudgeEmail, setInviteJudgeEmail] = useState("");
  const [inviteJudgeError, setInviteJudgeError] = useState("");
  const [outgoingJudgeInvites, setOutgoingJudgeInvites] = useState<Invite[]>(
    [],
  );
  const [refreshInvites, setRefreshInvites] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvites = async () => {
      try {
        const invites = (await getInvites(controller.signal)) as {
          message: string;
          invites: Invite[];
        };
        const organizerInvites = invites.invites.filter(
          (invite) => invite.role === "organizer",
        );
        const judgeInvites = invites.invites.filter(
          (invite) => invite.role === "judge",
        );
        setOutgoingOrganizerInvites(organizerInvites);
        setOutgoingJudgeInvites(judgeInvites);
      } catch (error) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

        console.error("Failed to fetch invites:", error);
      }
    };
    fetchInvites();

    return () => {
      controller.abort();
    };
  }, [refreshInvites]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        const data = await getStats(controller.signal);
        setStats(data.stats);
      } catch (error) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();

    return () => {
      controller.abort();
    };
  }, []);

  const handleInviteOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteOrganizerError("");
    try {
      await inviteOrganizer(inviteOrganizerEmail);
      toast.success("Successfully invited organizer");
      setInviteOrganizerEmail("");
      setRefreshInvites((prev) => !prev);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unkown error occurred";
      setInviteOrganizerError(errorMessage);
    }
  };

  const handleInviteJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteJudgeError("");
    try {
      await inviteJudge(inviteJudgeEmail);
      toast.success("Successfully invited judge");
      setInviteJudgeEmail("");
      setRefreshInvites((prev) => !prev);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setInviteJudgeError(errorMessage);
    }
  };

  const handleOpenCancelInvite = (email: string) => {
    openOverlay(<CancelInvite email={email} setReload={setRefreshInvites} />);
    setNavbarOpen(false);
  };

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Dashboard
        </h1>
        <div className="w-full flex flex-col sm:flex-row mt-4">
          <div className="w-full flex flex-col bg-surface-a1 rounded-lg p-4">
            <h3 className="text-2xl font-bold text-center">Invite Organizer</h3>
            <form onSubmit={handleInviteOrganizer} className="flex flex-col">
              <label htmlFor="email" className="text-2xl mt-2">
                Organizer Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={inviteOrganizerEmail}
                onChange={(e) => setInviteOrganizerEmail(e.target.value)}
                className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
                placeholder="Enter email to invite"
                required
              />
              {inviteOrganizerError && (
                <p className="text-red-500 text-lg mt-2">
                  {inviteOrganizerError}
                </p>
              )}
              <button
                type="submit"
                className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 mt-2 font-bold"
              >
                Invite
              </button>
            </form>
            {outgoingOrganizerInvites.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xl font-bold mb-2">Pending Invites:</h4>
                {outgoingOrganizerInvites.map((invite, index) => (
                  <div
                    key={index}
                    className="p-2 bg-surface-a2 rounded-lg mb-2"
                  >
                    <div className="flex flex-row">
                      <div className="flex flex-col">
                        <p className="text-lg">Email: {invite.email}</p>
                        <p className="text-lg">
                          Expires:{" "}
                          {formatDate(
                            invite.expires,
                            "EEEE, MMMM d yyyy h:mm a",
                          )}
                        </p>
                      </div>
                      <button
                        className="ml-auto self-center bg-surface-a3 hover:bg-surface-a4 p-2 rounded-lg"
                        onClick={() => handleOpenCancelInvite(invite.email)}
                      >
                        <IoTrash className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col bg-surface-a1 mt-2 sm:mt-0 sm:ml-2 rounded-lg p-4">
            <h3 className="text-2xl font-bold text-center">Invite Judge</h3>
            <form onSubmit={handleInviteJudge} className="flex flex-col">
              <label htmlFor="email" className="text-2xl mt-2">
                Judge Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={inviteJudgeEmail}
                onChange={(e) => setInviteJudgeEmail(e.target.value)}
                className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
                placeholder="Enter email to invite"
                required
              />
              {inviteJudgeError && (
                <p className="text-red-500 text-lg mt-2">{inviteJudgeError}</p>
              )}
              <button
                type="submit"
                className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 mt-2 font-bold"
              >
                Invite
              </button>
            </form>
            {outgoingJudgeInvites.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xl font-bold mb-2">Pending Invites:</h4>
                {outgoingJudgeInvites.map((invite, index) => (
                  <div
                    key={index}
                    className="p-2 bg-surface-a2 rounded-lg mb-2"
                  >
                    <div className="flex flex-row">
                      <div className="flex flex-col">
                        <p className="text-lg">Email: {invite.email}</p>
                        <p className="text-lg">
                          Expires:{" "}
                          {formatDate(
                            invite.expires,
                            "EEEE, MMMM d yyyy h:mm a",
                          )}
                        </p>
                      </div>
                      <button
                        className="ml-auto self-center bg-surface-a3 hover:bg-surface-a4 p-2 rounded-lg"
                        onClick={() => handleOpenCancelInvite(invite.email)}
                      >
                        <IoTrash className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-surface-a1 p-4 rounded-lg w-full flex flex-col mt-4">
          <h2 className="text-xl font-bold">User Stats</h2>
          <div className="grid grid-cols-5 gap-4 mt-2">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats?.totalUsers || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Users</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats?.studentUsers || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Students</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats?.organizerUsers || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Organizer</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats?.formerOrganizerUsers || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Former</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl text-primary-a0 font-bold">
                {stats?.judgeUsers || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Judges</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats
                  ? Math.round(
                      (stats.verifiedEmailUsers / stats.totalUsers) * 100,
                    )
                  : 0}
                %
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Verified</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats
                  ? Math.round((stats.govSchoolUsers / stats.totalUsers) * 100)
                  : 0}
                %
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Gov</span>{" "}
              {/* I shortened Gov School to Gov so I didn't have to change all the sizing just for this one work, if you have a problem with this I'm sorry, but it's not changing */}
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.regularTheme || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Regular</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.spookyTheme || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Spooky</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.spaceTheme || 0}
              </span>
              <span className="text-sm sm:text-lg md:text-xl">Space</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.frameworkTheme || 0}
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
                {stats?.workshops || 0}
              </span>
              <span className="text-lg">Workshops</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-4xl text-primary-a0 font-bold">
                {stats?.totalWorkshopParticipants || 0}
              </span>
              <span className="text-lg">Participants</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-4xl text-primary-a0 font-bold">
                {stats
                  ? Math.round(
                      stats.totalWorkshopParticipants / stats.workshops,
                    )
                  : 0}
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
                {stats?.events || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Events</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.totalEventParticipants || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Participants
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats
                  ? Math.round(stats.totalEventParticipants / stats.events)
                  : 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Average</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats ? Math.round(stats.averageShipRate * 100) : 0}%
              </span>
              <span className="text-sm sm:text-base md:text-lg">Ship Rate</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.projects || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Projects</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.averageCreativityScore || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Creativity
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.averageFunctionalityScore || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Functionality
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.averageTechnicalityScore || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">
                Technicality
              </span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.averageInterfaceScore || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Interface</span>
            </div>
            <div className="flex flex-col p-2 bg-surface-a2 rounded-lg items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl text-primary-a0 font-bold">
                {stats?.averageScore || 0}
              </span>
              <span className="text-sm sm:text-base md:text-lg">Overall</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
