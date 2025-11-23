import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import {
  organizerGetEmailById,
  getAllReceipients,
  getReceipientsByFilter,
  sendEmail,
} from "../../utils/EmailAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditEmail from "../../components/EditEmail";
import DeleteEmail from "../../components/DeleteEmail";
import OrganizerUserView from "../../components/OrganizerUserView";
import { getEventById } from "../../utils/EventAPIHandler";
import { getWorkshopById } from "../../utils/WorkshopAPIHandler";

export default function OrganizerEvent() {
  const { openOverlay } = useOverlay();
  const { emailId } = useParams<{ emailId: string }>();
  const [reload, setReload] = useState(false);

  interface Email {
    id: string;
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sent: boolean;
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

  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
  };

  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [receipients, setReceipients] = useState<Participant[]>([]);
  const [subFilterName, setSubFilterName] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        if (emailId) {
          const response = await organizerGetEmailById(emailId);
          setEmail(response.email);
        }
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [emailId, reload]);

  useEffect(() => {
    const fetchReceipients = async () => {
      if (!email) {
        return;
      }
      try {
        if (email.sendAll) {
          const response = await getAllReceipients();
          setReceipients(response.allReceipients);
        }
        switch (email.filterBy) {
          case "gradeLevel":
            {
              if (email.subFilterBy) {
                const response = await getReceipientsByFilter(
                  email.filterBy,
                  email.subFilterBy
                );
                setReceipients(response.receipientData);
                setSubFilterName(email.subFilterBy);
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "school":
            {
              if (email.subFilterBy) {
                const response = await getReceipientsByFilter(
                  email.filterBy,
                  email.subFilterBy
                );
                setReceipients(response.receipientData);
                setSubFilterName(email.subFilterBy);
              } else {
                throw Error("subfilter not found");
              }
            }
            break;
          case "event":
            {
              if (email.subFilterBy) {
                const response = await getReceipientsByFilter(
                  email.filterBy,
                  email.subFilterBy
                );
                setReceipients(response.receipientData);

                try {
                  const fetchedEvent = await getEventById(email.subFilterBy);
                  setSubFilterName(fetchedEvent.event.name);
                } catch (error: unknown) {
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
                const response = await getReceipientsByFilter(
                  email.filterBy,
                  email.subFilterBy
                );
                setReceipients(response.receipientData);

                try {
                  const fetchedWorkshop = await getWorkshopById(
                    email.subFilterBy
                  );
                  setSubFilterName(fetchedWorkshop.name);
                } catch (error: unknown) {
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
        console.error("Error fetching event:", error);
      }
    };
    fetchReceipients();
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
        />
      );
    }
  };

  const handleSendEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (emailId) {
        await sendEmail(emailId);
      }
      setReload((prev) => !prev);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unkown error accured";
      console.error(errorMessage);
    }
  };

  const handleOpenOrganizerUserView = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    if (emailId && email) {
      openOverlay(<OrganizerUserView user={receipients[index]} />);
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
              <button
                className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                onClick={handleSendEmail}
              >
                Send
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
                <p className="text-lg mb-2">{email.messageBody}</p>
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

                {email.sent ? (
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
                )}
              </div>
            </div>
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                Receipients ({receipients.length})
              </h2>
              {receipients.length > 0 ? (
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
                        School Division
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Grade Level
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Is RVGS
                      </th>
                      <th className="py-2 px-4 border-b border-surface-a1 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipients.map((participant, index) => (
                      <tr key={participant.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.firstName} {participant.lastName}
                        </td>
                        <td
                          className={`hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.email}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.schoolDivision}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {gradeMap[participant.gradeLevel]}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.isGovSchool ? "Yes" : "No"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={(e) =>
                              handleOpenOrganizerUserView(e, index)
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
                <p className="text-center">No Receipients with Filters</p>
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
