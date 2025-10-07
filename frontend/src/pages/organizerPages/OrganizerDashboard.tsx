import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { inviteOrganizer, inviteJudge } from "../../utils/AuthAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";

export default function OrganizerDashboard() {
  const [inviteOrganizerEmail, setInviteOrganizerEmail] = useState("");
  const [inviteOrganizerError, setInviteOrganizerError] = useState("");
  const [inviteJudgeEmail, setInviteJudgeEmail] = useState("");
  const [inviteJudgeError, setInviteJudgeError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleInviteOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteOrganizerError("");
    try {
      await inviteOrganizer(inviteOrganizerEmail);
      toast.success("Successfully invited organizer");
      setInviteOrganizerEmail("");
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
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        pauseOnHover={false}
      />
    </div>
  );
}
