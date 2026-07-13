import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { changeAccountType } from "../utils/AuthAPIHandler";
import { toast } from "react-toastify";

export default function OrganizerChangeAccountType({
  id,
  firstName,
  lastName,
  currentAccountType,
  setRefreshData,
}: {
  id: string;
  firstName: string;
  lastName: string;
  currentAccountType: "student" | "judge" | "organizer";
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newAccountType, setNewAccountType] = useState<
    "student" | "judge" | "organizer"
  >(currentAccountType);
  const { closeOverlay } = useOverlay();

  const handleDeleteUser = async () => {
    try {
      await changeAccountType(id, newAccountType);
      toast.success(
        `${firstName} ${lastName}'s account type has been changed.`,
      );
      setRefreshData((prev) => !prev);
      closeOverlay();
    } catch (error) {
      console.error("Error changing account type:", error);
      toast.error("Failed to change account type.");
    }
  };

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        Change {firstName} {lastName}'s Account Type
      </h1>
      <label htmlFor="newAccountType" className="text-lg sm:text-xl">
        New Account Type:
      </label>
      <select
        id="newAccountType"
        name="newAccountType"
        value={newAccountType}
        onChange={(e) =>
          setNewAccountType(e.target.value as "student" | "judge" | "organizer")
        }
        className="bg-surface-a2 p-2 rounded-lg text-xl"
      >
        <option value="student">Student</option>
        <option value="judge">Judge</option>
        <option value="organizer">Organizer</option>
      </select>
      <p className="text-lg sm:text-xl">
        Are you sure you want to change {firstName} {lastName}'s account type
        from{" "}
        <span className="font-bold text-primary-a0">{currentAccountType}</span>{" "}
        to <span className="font-bold text-primary-a0">{newAccountType}</span>?
      </p>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <button
          className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={handleDeleteUser}
        >
          Change Account Type
        </button>
        <button
          className="bg-surface-a2 hover:bg-surface-a3 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={closeOverlay}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
