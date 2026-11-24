import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getEmailListById,
  addToEmailList,
  deleteRecipientFromEmailList,
} from "../../utils/EmailAPIHandler";
import { toast } from "react-toastify";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import { useOverlay } from "../../contexts/OverlayContext";
import EditRecipient from "../../components/EditRecipient";
import axios from "axios";

interface Recipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailListId?: string;
}

interface EmailList {
  id: string;
  name: string;
  emails?: Recipient[];
  recipients?: Recipient[];
}

export default function OrganizerEmailList() {
  const { openOverlay } = useOverlay();
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

  const handleDeleteRecipient = async (recipientId: string) => {
    try {
      await deleteRecipientFromEmailList(recipientId);
      toast.success("Recipient deleted successfully");
      setReload((prev) => !prev);
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

  const handleOpenEditRecipient = (recipient: Recipient) => {
    openOverlay(<EditRecipient recipient={recipient} setReload={setReload} />);
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

  const recipients = emailList.emails || emailList.recipients || [];

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
          <div className="flex flex-col sm:flex-row gap-6 mx-6 mb-6">
            <div className="flex flex-col bg-surface-a1 p-4 rounded-lg w-full sm:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Add Email</h2>
              <form
                className="flex flex-col flex-1 justify-between gap-3"
                onSubmit={handleAddRecipient}
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-surface-a2 p-2 rounded-lg text-lg w-full"
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
                    className="bg-surface-a2 p-2 rounded-lg text-lg w-full"
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
                    className="bg-surface-a2 p-2 rounded-lg text-lg w-full"
                    value={newRecipientLastName}
                    onChange={(e) => setNewRecipientLastName(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                >
                  Add Recipient
                </button>
              </form>
            </div>
            <div className="flex flex-col bg-surface-a1 p-4 rounded-lg w-full sm:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Import Emails</h2>
              <form
                className="flex flex-col flex-1 justify-between gap-3"
                onSubmit={handleImportRecipients}
              >
                <textarea
                  className="bg-surface-a2 p-2 rounded-lg text-lg resize-none flex-1 min-h-[144px]"
                  placeholder="email, firstName, lastName"
                  value={newRecipientCSV}
                  onChange={(e) => setNewRecipientCSV(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                >
                  Import Recipients
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col bg-surface-a1 p-4 rounded-lg mx-6 mb-6">
            <div className="flex flex-row mb-2">
              <h2 className="text-2xl font-bold">
                Emails ({recipients.length})
              </h2>
            </div>
            {recipients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-surface-a2 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        First Name
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Last Name
                      </th>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Email
                      </th>
                      <th className="w-28 sm:w-32 py-2 px-4 border-b border-r border-surface-a1 text-left"></th>
                      <th className="w-28 sm:w-32 py-2 px-4 border-b border-surface-a1 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((recipient, index) => (
                      <tr key={recipient.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {recipient.firstName}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {recipient.lastName}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {recipient.email}
                        </td>
                        <td
                          className={`w-28 sm:w-32 py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="w-full bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={() => handleOpenEditRecipient(recipient)}
                          >
                            Edit
                          </button>
                        </td>
                        <td
                          className={`w-28 sm:w-32 py-2 px-4 border-b border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="w-full bg-red-500 hover:bg-red-600 p-2 rounded-lg font-bold"
                            onClick={() => handleDeleteRecipient(recipient.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center">No emails added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
