import React, { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { updateRecipientInEmailList } from "../utils/EmailAPIHandler";
import { toast } from "react-toastify";

interface Recipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function EditRecipient({
  recipient,
  setReload,
}: {
  recipient: Recipient;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [email, setEmail] = useState(recipient.email);
  const [firstName, setFirstName] = useState(recipient.firstName);
  const [lastName, setLastName] = useState(recipient.lastName);
  const [error, setError] = useState("");

  const handleUpdateRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      await updateRecipientInEmailList(recipient.id, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Recipient updated successfully");
      setReload((prev) => !prev);
      closeOverlay();
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl font-bold text-center">Edit Recipient</h1>
      <form className="flex flex-col" onSubmit={handleUpdateRecipient}>
        <label htmlFor="edit-email" className="text-2xl mt-2">
          Email
        </label>
        <input
          type="email"
          id="edit-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="edit-firstName" className="text-2xl mt-2">
          First Name
        </label>
        <input
          type="text"
          id="edit-firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="edit-lastName" className="text-2xl mt-2">
          Last Name
        </label>
        <input
          type="text"
          id="edit-lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
        <div className="w-full flex flex-row mt-4">
          <button
            type="submit"
            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg ml-2 w-full font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
