import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import CreateEmail from "../../components/CreateEmail";
import EditEmail from "../../components/EditEmail";
import DeleteEmail from "../../components/DeleteEmail";
import { organizerGetAllEmails } from "../../utils/EmailAPIHandler";

export default function OrganizerEmails() {
  const { openOverlay } = useOverlay();
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
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const fetchedEmails = await organizerGetAllEmails();
        console.log(fetchedEmails, typeof fetchedEmails);
        setEmails(fetchedEmails.allEmails as Email[]);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unkown error accured";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, [reload]);

  const handleOpenCreateEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<CreateEmail />);
  };

  const handleOpenEditEmail = (
    e: React.MouseEvent<HTMLButtonElement>,
    emailId: string
  ) => {
    e.preventDefault();
    openOverlay(<EditEmail emailId={emailId} setReload={setReload} />);
  };

  const handleOpenDeleteEmail = (
    e: React.MouseEvent<HTMLButtonElement>,
    emailId: string,
    emailName: string
  ) => {
    e.preventDefault();
    openOverlay(
      <DeleteEmail
        emailId={emailId}
        emailName={emailName}
        currentPage="emails"
        setReload={setReload}
      />
    );
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
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Emails
              </h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateEmail}
              >
                New Email
              </button>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading emails...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Emails
              </h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateEmail}
              >
                Add Email
              </button>
            </div>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-center">
                An error occured while fetching the events:
              </h2>
              <p className="text-xl sm:text-2xl text-red-500 mt-2">{error}</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full h-[calc(10%)]">
          <div className="hidden sm:block" />
          <div className="flex items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Emails
            </h1>
          </div>
          <div className="flex items-center">
            <button
              className="ml-auto p-2 rounded-lg sm:text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleOpenCreateEmail}
            >
              New Email
            </button>
          </div>
        </div>
        {emails.length === 0 ? (
          <p className="text-2xl mt-8">No emails yet</p>
        ) : (
          <div className="w-full h-full flex flex-col items-center overflow-y-scroll">
            {emails.map((email) => (
              <div
                key={email.id}
                className="flex flex-col sm:flex-row bg-surface-a1 w-full sm:w-5/6 mt-2 mb-4 p-4 rounded-lg"
              >
                <div className="flex w-full justify-between">
                  <div className="flex flex-col w-3/4">
                    <h2 className="text-3xl font-bold">{email.name}</h2>
                    <h2 className="text-xl font-bold">
                      {email.messageSubject}
                    </h2>
                    <p className="text-lg line-clamp-2">{email.messageBody}</p>
                  </div>

                  <div className="flex flex-col mt-auto gap-2 items-center w-1/4">
                    <Link
                      to={`/app/organizer/email/${email.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    <button
                      className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold w-full"
                      onClick={(e) => handleOpenEditEmail(e, email.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 rounded-lg font-bold w-full"
                      onClick={(e) =>
                        handleOpenDeleteEmail(e, email.id, email.name)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
