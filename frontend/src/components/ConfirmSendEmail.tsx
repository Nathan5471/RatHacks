import { useState } from "react";
import type React from "react";
import { toast } from "react-toastify";
import {
  sendEmail,
  activateEmail,
  deactivateEmail,
} from "../utils/EmailAPIHandler";
import { useOverlay } from "../contexts/OverlayContext";

interface Email {
  id: string;
  name: string;
  messageSubject: string;
  messageBody: string;
  sendAll: boolean;
  filterBy: string | null;
  subFilterBy: string | null;
  sendOnJoin: boolean | null;
  active: boolean;
  sentTo: string[];
  sentTimes: string[];
  createdAt: string;
}

export default function ConfirmSendEmail({
  email,
  type,
  setReload,
}: {
  email: Email;
  type: "send" | "activate" | "deactivate";
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (type === "send") {
        await sendEmail(email.id);
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 1500); // Allow time to send out emails
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 5000);
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 15000); // You'll have to refresh your self if you're sending more than 30 emails
      } else if (type === "activate") {
        await activateEmail(email.id);
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 1500);
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 5000);
        setTimeout(() => {
          setReload((prev) => !prev);
        }, 15000);
      } else if (type === "deactivate") {
        await deactivateEmail(email.id);
        setReload((prev) => !prev);
      }
      toast.success(`Successfully ${type}d email`);
      closeOverlay();
    } catch (error: unknown) {
      console.error("Error sending email:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      toast.error(`Failed to ${type} email: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">
        {type[0].toUpperCase() + type.slice(1)} Email
      </h1>
      <p className="text-center mt-4">
        Are you sure you want to {type} this email, "{email.name}"?
      </p>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      <div className="flex flex-row w-full mt-4">
        <button
          onClick={handleSendEmail}
          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold mr-2"
        >
          {type[0].toUpperCase() + type.slice(1)}
        </button>
        <button
          onClick={closeOverlay}
          className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-full font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
