import { useOverlay } from "../contexts/OverlayContext";
import { organizerDeleteUser } from "../utils/AuthAPIHandler";
import { toast } from "react-toastify";

export default function OrganizerDeleteUser({
  id,
  firstName,
  lastName,
  setRefreshData,
}: {
  id: string;
  firstName: string;
  lastName: string;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();

  const handleDeleteUser = async () => {
    try {
      await organizerDeleteUser(id);
      toast.success(`${firstName} ${lastName} has been deleted.`);
      if (setRefreshData) {
        setRefreshData((prev) => !prev);
      }
      closeOverlay();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        Delete {firstName} {lastName}
      </h1>
      <p className="text-lg sm:text-xl">
        Are you sure you want to delete {firstName} {lastName}'s account?
      </p>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <button
          className="bg-red-500 hover:bg-red-400 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={handleDeleteUser}
        >
          Delete User
        </button>
        <button
          className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={closeOverlay}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
