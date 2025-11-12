import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  organizerGetUserByEmail,
  checkInUser,
} from "../../utils/EventAPIHandler";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import { IoMenu } from "react-icons/io5";

export default function CheckIn() {
  const { eventId } = useParams();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [email, setEmail] = useState("");
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<
    "awaitingUser" | "checkingIn" | "checkedIn"
  >("awaitingUser");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const fetchedUser = await organizerGetUserByEmail(email);
      setUser(fetchedUser.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
      setUser(null);
    } finally {
      setStatus("checkingIn");
    }
  };

  const handleCheckIn = async () => {
    if (!eventId || !user) return;
    setError("");
    try {
      await checkInUser(eventId, user.id);
    } catch (error) {
      console.error("Error checking in user:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setStatus("checkedIn");
    }
  };

  if (status === "awaitingUser") {
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
          <div
            onSubmit={handleLookup}
            className="w-full sm:w-5/6 h-full mt-5 flex items-center justify-center mb-2"
          >
            <form className="flex flex-col w-120 bg-surface-a1 p-4 rounded-lg">
              <h1 className="text-4xl font-bold text-center text-primary-a0 spooky:text-spooky-a0 mb-4">
                Check In
              </h1>
              <label htmlFor="userEmail" className="text-2xl mb-2">
                Enter your email:
              </label>
              <input
                type="email"
                name="userEmail"
                id="userEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="p-2 rounded-lg text-lg w-full bg-surface-a2 mb-2"
              />
              <button
                type="submit"
                className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg"
              >
                Check In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (status === "checkingIn") {
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
          <div
            onSubmit={handleLookup}
            className="w-full sm:w-5/6 h-full mt-5 flex items-center justify-center mb-2"
          >
            <div className="flex flex-col w-120 bg-surface-a1 p-4 rounded-lg">
              <h1 className="text-4xl font-bold text-center text-primary-a0 spooky:text-spooky-a0 mb-4">
                {user ? "User Found" : "User Not Found"}
              </h1>
              {!user && (
                <>
                  <p className="text-center text-lg">
                    No user found with this email: {email}. Please try again.
                    Error message: {error}
                  </p>
                  <button
                    onClick={() => {
                      setUser(null);
                      setEmail("");
                      setError("");
                      setStatus("awaitingUser");
                    }}
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg mt-2"
                  >
                    Back to Email
                  </button>
                </>
              )}
              {user && (
                <>
                  <p className="text-lg mb-1">Email: {user.email}</p>
                  <p className="text-lg mb-2">
                    Name: {user.firstName} {user.lastName}
                  </p>
                  <div className="flex flex-row">
                    <button
                      onClick={handleCheckIn}
                      className="w-full bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg"
                    >
                      Confirm Check-In
                    </button>
                    <button
                      onClick={() => {
                        setUser(null);
                        setEmail("");
                        setError("");
                        setStatus("awaitingUser");
                      }}
                      className="w-full ml-2 bg-surface-a2 hover:bg-surface-a3 text-white font-bold p-2 rounded-lg"
                    >
                      Not You?
                    </button>
                  </div>
                </>
              )}
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
        <div
          onSubmit={handleLookup}
          className="w-full sm:w-5/6 h-full mt-5 flex items-center justify-center mb-2"
        >
          <form className="flex flex-col w-120 bg-surface-a1 p-4 rounded-lg">
            <h1 className="text-4xl font-bold text-center text-primary-a0 spooky:text-spooky-a0 mb-4">
              {error ? "Check In Failed" : "Checked In Successfully!"}
            </h1>
            {error ? (
              <>
                <p className="text-center text-lg">
                  Failed to check in user. Error message: {error}
                </p>
                <div className="flex flex-row">
                  <button
                    onClick={() => {
                      setUser(null);
                      setEmail("");
                      setError("");
                      setStatus("awaitingUser");
                    }}
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg mt-2"
                  >
                    Back to Email
                  </button>
                  <button
                    onClick={handleCheckIn}
                    className="w-full ml-2 bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg mt-2"
                  >
                    Retry Check-In
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-center text-lg">
                  Checked in {user?.firstName} {user?.lastName} Successfully!
                </p>
                <button
                  onClick={() => {
                    setUser(null);
                    setEmail("");
                    setError("");
                    setStatus("awaitingUser");
                  }}
                  className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 text-white font-bold p-2 rounded-lg mt-2"
                >
                  Back to Email
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
