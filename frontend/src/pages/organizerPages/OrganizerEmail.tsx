import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetEmailById } from "../../utils/EmailAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditEvent from "../../components/EditEvent";
import DeleteEmail from "../../components/DeleteEmail";

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

  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        if (emailId) {
          const response = await organizerGetEmailById(emailId);
          console.log("received emails", response);
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

  const handleOpenEditEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (emailId) {
      openOverlay(<EditEvent eventId={emailId} setReload={setReload} />);
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
            <div className="flex flex-col sm:flex-row bg-surface-a1 mt-2 p-4 rounded-lg">
              <div className="flex flex-col w-full sm:w-2/3">
                <p className="text-lg mb-2">{email.messageBody}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/organizer/emails"
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Emails
                  </Link>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={handleOpenEditEvent}
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
              </div>
              <div className="flex flex-col w-full sm:w-1/3 sm:ml-2">
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

                {email.filterBy && (
                  <div className="flex gap-1">
                    <span className="font-bold">Filter:</span> {email.filterBy}
                  </div>
                )}

                {email.subFilterBy && (
                  <div className="flex gap-1">
                    <span className="font-bold">Sub Filter:</span>{" "}
                    {email.subFilterBy}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Email not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/emails"
                className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg"
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
