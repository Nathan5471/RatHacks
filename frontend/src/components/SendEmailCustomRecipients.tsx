import { useState } from "react";
import type React from "react";
import { toast } from "react-toastify";
import { sendEmailToCustomRecipients } from "../utils/EmailAPIHandler";
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

export default function SendEmailCustomRecipients({ email }: { email: Email }) {
  const { closeOverlay } = useOverlay();
  const [csvInput, setCsvInput] = useState<string>("");
  const [recipients, setRecipients] = useState<
    { email: string; firstName: string; lastName: string }[]
  >([]);
  const [parseMessage, setParseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCsvChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvInput(e.target.value);
    setParseMessage(null);
    setError(null);
    if (!e.target.value.trim()) {
      setRecipients([]);
      return;
    }
    const lines = e.target.value.split("\n");
    const parsedLines = lines.map((line) => line.split(","));
    const newRecipients: {
      email: string;
      firstName: string;
      lastName: string;
    }[] = [];
    for (const recipient of parsedLines) {
      if (recipient.length !== 3) {
        setParseMessage(
          `Invalid format in line: "${recipient.join(",")}". Each line must have exactly 3 values.`,
        );
        return;
      }
      newRecipients.push({
        email: recipient[0].trim(),
        firstName: recipient[1].trim(),
        lastName: recipient[2].trim(),
      });
    }
    setRecipients(newRecipients);
    setParseMessage(`Successfully parsed ${newRecipients.length} recipients.`);
  };

  const handleSendEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    if (recipients.length === 0) {
      setError("No valid recipients to send email to.");
      return;
    }
    try {
      await sendEmailToCustomRecipients(email.id, recipients);
      toast.success(`Successfully sent email`);
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
      toast.error(`Failed to send email: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col w-80 sm:w-120">
      <h1 className="text-2xl font-bold text-center">Send {email.name}</h1>
      <p className="mt-2">
        Enter the csv list of recipients you would like to send this email to.
        The format should be: email, firstName, lastName
      </p>
      <textarea
        className="bg-surface-a2 p-2 rounded-lg"
        placeholder="email, firstName, lastName"
        value={csvInput}
        onChange={handleCsvChange}
      />
      {parseMessage && <p className="text-center mt-2">{parseMessage}</p>}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      <div className="flex flex-row w-full mt-4">
        <button
          onClick={handleSendEmail}
          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold mr-2"
        >
          Send Email
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
