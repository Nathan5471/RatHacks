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
}
