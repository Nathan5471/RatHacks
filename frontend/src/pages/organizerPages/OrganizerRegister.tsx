import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  checkOrganizerInvite,
  registerOrganizer,
} from "../../utils/AuthAPIHandler";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function OrganizerRegister() {
  const [serachParams] = useSearchParams();
  const email = serachParams.get("email") || "";
  const token = serachParams.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<"loading" | "invalid" | "registering">(
    "loading"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const checkInvite = async () => {
      try {
        await checkOrganizerInvite(email, token);
        setStatus("registering");
      } catch (error) {
        console.error("Invite check error:", error);
        setStatus("invalid");
      }
    };
    if (!email || !token) {
      setStatus("invalid");
      return;
    }
    if (status === "loading") {
      checkInvite();
    }
  }, [email, token, status]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await registerOrganizer({ email, password, firstName, lastName, token });
      navigate("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
      return;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 sm:w-100 bg-surface-a1 p-4 m-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center">Loading...</h1>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
        <div className="flex flex-col w-80 sm:w-100 bg-surface-a1 p-4 m-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
            Invalid Invite
          </h1>
          <p className="text-center">
            The invite link is either expired, already used, or invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
      <form
        className="flex flex-col w-80 sm:w-100 bg-surface-a1 p-4 m-4 rounded-lg"
        onSubmit={handleRegister}
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-primary-a0 spooky:text-spooky-a0 space:text-space-a0">
          Organizer Registration
        </h1>
        <p className="text-lg">Email: {email}</p>
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-col w-1/2">
            <label htmlFor="firstName" className="text-2xl">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-surface-a2 p-2 rounded-lg mt-1"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="flex flex-col w-1/2 ml-2">
            <label htmlFor="lastName" className="text-2xl">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-surface-a2 p-2 rounded-lg mt-1"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
        <label htmlFor="password" className="text-2xl mt-2">
          Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 bg-surface-a2 hover:bg-surface-a3 rounded-lg p-2"
          >
            {showPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        <label htmlFor="confirmPassword" className="text-2xl mt-2">
          Confirm Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2 bg-surface-a2 hover:bg-surface-a3 rounded-lg p-2"
          >
            {showConfirmPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 font-bold p-2 rounded-lg mt-4"
        >
          Register
        </button>
      </form>
    </div>
  );
}
