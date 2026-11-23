import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getEmailListById,
  addToEmailList,
  deleteRecipientFromEmailList,
  deleteEmailList,
} from "../../utils/EmailAPIHandler";
import { toast } from "react-toastify";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import axios from "axios";

interface Recipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface EmailList {
  id: string;
  name: string;
  recipients: Recipient[];
}

export default function OrganizerEmailList() {
  const { emailListId } = useParams<{ emailListId: string }>();
  const [emailList, setEmailList] = useState<EmailList | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientFirstName, setNewRecipientFirstName] = useState("");
  const [newRecipientLastName, setNewRecipientLastName] = useState("");
  const [newRecipientCSV, setNewRecipientCSV] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchEmailList = async () => {
      if (!emailListId) {
        setError("Email list ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const fetchedEmailList = await getEmailListById(
          emailListId,
          controller.signal,
        );
        setEmailList(fetchedEmailList);
      } catch (error: unknown) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

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

    fetchEmailList();

    return () => {
      controller.abort();
    };
  }, [emailListId, reload]);

  const handleAddRecipient = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailListId) {
      toast.error("Email list ID is missing.");
      return;
    }

    if (
      !newRecipientEmail.trim() ||
      !newRecipientFirstName.trim() ||
      !newRecipientLastName.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      await addToEmailList(emailListId, [
        {
          email: newRecipientEmail,
          firstName: newRecipientFirstName,
          lastName: newRecipientLastName,
        },
      ]);
      setReload((prev) => !prev);
      setNewRecipientEmail("");
      setNewRecipientFirstName("");
      setNewRecipientLastName("");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      toast.error(errorMessage);
    }
  };

  const handleImportRecipients = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!emailListId) {
      toast.error("Email list ID is missing.");
      return;
    }

    if (!newRecipientCSV.trim()) {
      toast.error("CSV input cannot be empty.");
      return;
    }

    const lines = newRecipientCSV.split("\n");
    const parsedLines = lines.map((line) => line.split(","));
    const newRecipients: {
      email: string;
      firstName: string;
      lastName: string;
    }[] = [];
    for (const recipient of parsedLines) {
      if (recipient.length !== 3) {
        toast.error(
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

    try {
      await addToEmailList(emailListId, newRecipients);
      setReload((prev) => !prev);
      setNewRecipientCSV("");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      toast.error(errorMessage);
    }
  };

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
          <h1 className="text-4xl">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !emailList) {
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
          <div className="flex items-center justify-center w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Email List
              </h1>
            </div>
          </div>
          <p className="text-2xl mt-8">Error: {error}</p>
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
        <div className="flex flex-col w-full h-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            {emailList.name}
          </h1>
          <div className="flex flex-row gap-6 m-6">
            <div className="flex flex-col bg-surface-a1 p-6 w-1/2">
              <h2 className="text-xl font-bold mb-2">Add Email</h2>
              <form
                className="grid grid-cols-2 gap-2"
                onSubmit={handleAddRecipient}
              >
                <label htmlFor="email" className="text-lg">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-surface-a2 p-2 rounded-lg text-lg"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  required
                />
                <label htmlFor="firstName" className="text-lg">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="bg-surface-a2 p-2 rounded-lg text-lg"
                  value={newRecipientFirstName}
                  onChange={(e) => setNewRecipientFirstName(e.target.value)}
                  required
                />
                <label htmlFor="lastName" className="text-lg">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="bg-surface-a2 p-2 rounded-lg text-lg"
                  value={newRecipientLastName}
                  onChange={(e) => setNewRecipientLastName(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="col-span-2 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                >
                  Add Recipient
                </button>
              </form>
            </div>
            <div className="flex flex-col bg-surface-a1 p-2 w-1/2">
              <form
                className="flex flex-col gap-2"
                onSubmit={handleImportRecipients}
              >
                <h2 className="text-xl font-bold">Import Emails</h2>
                <textarea
                  className="bg-surface-a2 p-2 rounded-lg h-full resize-none"
                  placeholder="email, firstName, lastName"
                  value={newRecipientCSV}
                  onChange={(e) => setNewRecipientCSV(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg text-lg font-bold"
                >
                  Import Recipients
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
