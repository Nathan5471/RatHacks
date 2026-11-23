import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import { getEmailLists, createEmailList } from "../../utils/EmailAPIHandler";
import axios from "axios";

interface EmailList {
  id: string;
  name: string;
  recipientCount: number;
}

export default function OrganizerEmailLists() {
  const [reload, setReload] = useState(false);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEmailLists = async () => {
      try {
        const fetchedEmailLists = await getEmailLists(controller.signal);
        setEmailLists(fetchedEmailLists);
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

    fetchEmailLists();

    return () => {
      controller.abort();
    };
  }, [reload]);

  const handleCreateEmailList = async () => {
    if (!newListName.trim()) {
      // toast the error
      return;
    }

    try {
      await createEmailList(newListName);
      setReload((prev) => !prev);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      // toast this one too
    }
    setNewListName("");
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
          <div className="flex items-center justify-center w-full h-[calc(10%)]">
            <div className="hidden sm:block" />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Email Lists
              </h1>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading email lists...</p>
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
          <div className="flex items-center justify-center w-full h-[calc(10%)]">
            <div className="flex items-center justify-center text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Email Lists
              </h1>
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
        <div className="flex items-center justify-center w-full h-[calc(10%)]">
          <div className="flex items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Email Lists
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            placeholder="New email list name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg text-xl w-1/2"
          />
          <button
            className="bg-primary-a0 hover:bg-primary-a1 text-white p-2 rounded-lg text-xl font-bold ml-2"
            onClick={handleCreateEmailList}
          >
            Create
          </button>
        </div>
        {emailLists.length === 0 ? (
          <p className="text-2xl mt-8">No email lists yet</p>
        ) : (
          <div className="w-full h-full mt-5 flex flex-col items-center overflow-y-scroll gap-3">
            {emailLists.map((list) => (
              <div
                className="flex bg-surface-a1 p-4 rounded-lg w-3/4"
                key={list.id}
              >
                <h3 className="text-2xl">
                  {list.name} ({list.recipientCount} emails)
                </h3>
                <Link
                  to={`/app/organizer/emailList/${list.id}`}
                  className="ml-auto bg-primary-a0 hover:bg-primary-a1 text-white p-2 rounded-lg text-2xl font-bold"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
