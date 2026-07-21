import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { useOverlay } from "../../contexts/OverlayContext";
import {
  organizerGetEmailById,
  getAllRecipients,
  getRecipientsByFilter,
  sendTestEmail,
} from "../../utils/EmailAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditEmail from "../../components/EditEmail";
import DeleteEmail from "../../components/DeleteEmail";
import ConfirmSendEmail from "../../components/ConfirmSendEmail";
import SendEmailCustomRecipients from "../../components/SendEmailCustomRecipients";
import OrganizerUserView from "../../components/OrganizerUserView";
import { getEventById } from "../../utils/EventAPIHandler";
import { getWorkshopById } from "../../utils/WorkshopAPIHandler";
import axios from "axios";

interface EmailReceipt {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sentAt: string;
  seen: boolean;
  seenAt: string | null;
}
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
  sentTo: EmailReceipt[];
  createdAt: string;
}
interface Participant {
  id: string;
  email: string;
  emailVerified: boolean;
  accountType: "student" | "organizer" | "judge";
  firstName: string;
  lastName: string;
  schoolDivision: string;
  gradeLevel: "nine" | "ten" | "eleven" | "twelve";
  isGovSchool: boolean;
  techStack: string;
  previousHackathon: boolean;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  contactFirstName: string;
  contactLastName: string;
  contactRelationship: string;
  contactPhoneNumber: string;
  createdAt: string;
}

export default function OrganizerEvent() {
  const { openOverlay } = useOverlay();
  const { emailId } = useParams<{ emailId: string }>();
  const [reload, setReload] = useState(false);
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [recipients, setRecipients] = useState<Participant[]>([]);
  const [subFilterName, setSubFilterName] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEmail = async () => {
      try {
        if (emailId) {
          const response = await organizerGetEmailById(
            emailId,
            controller.signal,
          );
          setEmail(response.email);
        }
      } catch (error: unknown) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();

    return () => {
      controller.abort();
    };
  }, [emailId, reload]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecipients = async () => {
      if (!email) {
        return;
      }
      try {
        if (email.sendAll) {
          const response = await getAllRecipients(controller.signal);
          setRecipients(response.allRecipients);
          return;
        }
        switch (email.filterBy) {
          case "gradeLevel":
            {
              if (email.subFilterBy) {
                const response = await getRecipientsByFilter(
                  email.filterBy,
                  email.subFilterBy,
                  controller.signal,
                );
                setRecipients(response.recipientData);
                setSubFilterName(email.subFilterBy);
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "school":
            {
              if (email.subFilterBy) {
                const response = await getRecipientsByFilter(
                  email.filterBy,
                  email.subFilterBy,
                  controller.signal,
                );
                setRecipients(response.recipientData);
                setSubFilterName(email.subFilterBy);
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "event":
            {
              if (email.subFilterBy) {
                const response = await getRecipientsByFilter(
                  email.filterBy,
                  email.subFilterBy,
                  controller.signal,
                );
                setRecipients(response.recipientData);

                try {
                  const fetchedEvent = await getEventById(
                    email.subFilterBy,
                    controller.signal,
                  );
                  setSubFilterName(fetchedEvent.event.name);
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
                      : "An unkown error accured";
                  console.error(errorMessage);
                }
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "workshop":
            {
              if (email.subFilterBy) {
                const response = await getRecipientsByFilter(
                  email.filterBy,
                  email.subFilterBy,
                  controller.signal,
                );
                setRecipients(response.recipientData);

                try {
                  const fetchedWorkshop = await getWorkshopById(
                    email.subFilterBy,
                    controller.signal,
                  );
                  setSubFilterName(fetchedWorkshop.name);
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
                      : "An unkown error accured";
                  console.error(errorMessage);
                }
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "accountType":
            {
              if (email.subFilterBy) {
                try {
                  const response = await getRecipientsByFilter(
                    email.filterBy,
                    email.subFilterBy,
                    controller.signal,
                  );
                  setRecipients(response.recipientData);
                  setSubFilterName(email.subFilterBy);
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
                      : "An unkown error accured";
                  console.error(errorMessage);
                }
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
        }
      } catch (error: unknown) {
        if (
          axios.isCancel(error) ||
          (error instanceof Error && error.name === "CanceledError")
        ) {
          return;
        }

        console.error("Error fetching event:", error);
      }
    };
    fetchRecipients();

    return () => {
      controller.abort();
    };
  }, [reload, email]);

  const handleOpenEditEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (emailId) {
      openOverlay(<EditEmail emailId={emailId} setReload={setReload} />);
    }
  };

  const handleOpenDeleteEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (emailId && email) {
      openOverlay(
        <DeleteEmail
          emailId={emailId}
          emailName={email.name}
          currentPage="email"
          setReload={undefined}
        />,
      );
    }
  };

  const handleOpenOrganizerUserView = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: String,
  ) => {
    e.preventDefault();
    if (emailId && email) {
      const user = recipients.find((recipient) => recipient.id === userId);
      if (!user) {
        toast.error("User not found");
        return;
      }
      openOverlay(<OrganizerUserView user={user} setRefreshData={setReload} />);
    }
  };

  const handleSendTestEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (emailId) {
        sendTestEmail(emailId);
        toast.success("Successfully sent test email");
      }
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unkown error accured";
      console.error(errorMessage);
      toast.error("Failed to send test email");
    }
  };

  const handleSendEmailToCustomRecipients = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    openOverlay(<SendEmailCustomRecipients email={email as Email} />);
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
        {email ? (
          <div className="w-full sm:w-5/6 mt-5 flex flex-col mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
              {email.name}
            </h1>
            <div className="flex flex-row w-full mt-auto">
              <Link
                to="/app/organizer/emails"
                className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
              >
                Back to Emails
              </Link>
              {!email.sendOnJoin && (
                <button
                  className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                  onClick={() =>
                    openOverlay(
                      <ConfirmSendEmail
                        type="send"
                        email={email}
                        setReload={setReload}
                      />,
                    )
                  }
                >
                  Send
                </button>
              )}
              {email.sendOnJoin &&
                (email.active ? (
                  <button
                    className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={() =>
                      openOverlay(
                        <ConfirmSendEmail
                          type="deactivate"
                          email={email}
                          setReload={setReload}
                        />,
                      )
                    }
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={() =>
                      openOverlay(
                        <ConfirmSendEmail
                          type="activate"
                          email={email}
                          setReload={setReload}
                        />,
                      )
                    }
                  >
                    Activate
                  </button>
                ))}
              <button
                className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                onClick={handleSendTestEmail}
              >
                Send Test
              </button>
              <button
                className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                onClick={handleOpenEditEmail}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                onClick={handleOpenDeleteEmail}
              >
                Delete
              </button>
            </div>
            <div className="flex flex-col sm:flex-row bg-surface-a1 mt-4 p-4 rounded-lg">
              <div className="flex flex-col w-full sm:w-2/3">
                <ReactMarkdown
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h1: ({ node, ...props }) => (
                      <h1 className="text-4xl font-bold" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl font-bold" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl font-semibold" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h4: ({ node, ...props }) => (
                      <h4 className="text-xl font-semibold" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h5: ({ node, ...props }) => (
                      <h5 className="text-lg font-semibold" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    a: ({ node, ...props }) => (
                      <a
                        className="text-primary-a0 hover:underline"
                        {...props}
                      />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside my-2" {...props} />
                    ),
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside my-2"
                        {...props}
                      />
                    ),
                  }}
                >
                  {email.messageBody}
                </ReactMarkdown>
              </div>
              <div className="flex flex-col w-full sm:w-1/3 sm:ml-2 justify-center">
                {email.messageSubject && (
                  <div className="flex gap-1">
                    <span className="font-bold">Subject:</span>
                    <p>{email.messageSubject}</p>
                  </div>
                )}
                {email.sendAll && (
                  <div className="flex gap-1">
                    <span className="font-bold">Send All:</span>
                    <p>true</p>
                  </div>
                )}
                {!email.sendAll && (
                  <div className="flex gap-1">
                    <span className="font-bold">Send All:</span>
                    <p>false</p>
                  </div>
                )}

                {email.filterBy && subFilterName && (
                  <div className="flex gap-1">
                    <span className="font-bold">Filter:</span>
                    {email.filterBy} ({subFilterName})
                  </div>
                )}

                {!email.sendOnJoin &&
                  (email.sentTo.length > 0 ? (
                    <div className="flex gap-1">
                      <span className="font-bold italic text-primary-a0">
                        Sent
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <span className="font-bold italic text-red-500">
                        Not Sent
                      </span>
                    </div>
                  ))}
                {email.sendOnJoin &&
                  (email.active ? (
                    <div className="flex gap-1">
                      <span className="font-bold italic text-primary-a0">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <span className="font-bold italic text-red-500">
                        Inactive
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <div className="flex flex-row mb-2">
                <h2 className="text-2xl font-bold text-center">
                  Recipients ({recipients.length})
                </h2>
                <button
                  className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-auto rounded-lg font-bold w-full sm:w-auto"
                  onClick={handleSendEmailToCustomRecipients}
                >
                  Send to Custom Recipients
                </button>
              </div>
              {recipients.length > 0 ? (
                <table className="min-w-full bg-surface-a2 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Name
                      </th>
                      <th className="hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Email
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Sent
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Sent Time
                      </th>
                      <th className="py-2 px-4 border-b border-surface-a1 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {email.sentTo.map((emailReceipt, index) => (
                      <tr key={emailReceipt.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {emailReceipt.user.firstName}{" "}
                          {emailReceipt.user.lastName}
                        </td>
                        <td
                          className={`hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {emailReceipt.user.email}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {emailReceipt.sentAt ? "Yes" : "No"}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {emailReceipt.sentAt || "N/A"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={(e) =>
                              handleOpenOrganizerUserView(
                                e,
                                emailReceipt.user.id,
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No Recipients with Filters</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Email not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/emails"
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-white"
              >
                Back to Emails
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
