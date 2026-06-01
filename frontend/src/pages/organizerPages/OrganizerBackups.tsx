import { useState, useEffect } from "react";
import {
  getAllBackups,
  generateBackup,
  downloadBackup,
} from "../../utils/BackupAPIHandler";
import { useOverlay } from "../../contexts/OverlayContext";
import UploadBackup from "../../components/UploadBackup";
import ConfirmLoadBackup from "../../components/ConfirmLoadBackup";
import DeleteBackup from "../../components/DeleteBackup";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";

export default function OrganizerBackups() {
  const { openOverlay } = useOverlay();
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const data = await getAllBackups();
        setBackups(data.backups);
      } catch (error) {
        console.error("Error fetching backups:", error);
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
    fetchBackups();
  }, [reload]);

  const handleGenerateBackup = async () => {
    try {
      await generateBackup();
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error generating backup:", error);
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

  const handleUploadBackup = () => {
    openOverlay(<UploadBackup setReload={setReload} />);
  };

  const handleDownloadBackup = async (backupName: string) => {
    try {
      const backupBlob = await downloadBackup(backupName);
      const url = window.URL.createObjectURL(new Blob([backupBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", backupName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading backup:", error);
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

  const handleOpenLoadBackup = (backupName: string) => {
    openOverlay(<ConfirmLoadBackup backupName={backupName} />);
  };

  const handleDeleteBackup = (backupName: string) => {
    openOverlay(<DeleteBackup backupName={backupName} setReload={setReload} />);
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
          <p className="text-2xl font-bold">Loading backups...</p>
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center justify-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <div className="bg-surface-a2 p-4 rounded-lg flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">
              An Error Occurred
            </h1>
            <p className="text-lg">{error}</p>
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
              Backups
            </h1>
          </div>
          <div className="flex items-center">
            <button
              className="ml-auto p-2 rounded-lg sm:text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleGenerateBackup}
            >
              Generate Backup
            </button>
            <button
              className="ml-2 p-2 rounded-lg sm:text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleUploadBackup}
            >
              Upload
            </button>
          </div>
        </div>
        {backups.length === 0 ? (
          <p className="text-lg mt-4">No backups found.</p>
        ) : (
          <div className="w-full h-full flex flex-col items-center overflow-y-scroll">
            {backups.map((backup) => (
              <div
                key={backup}
                className="w-full sm:w-3/4 bg-surface-a2 p-4 rounded-lg mb-4 flex items-center justify-between"
              >
                <p className="text-lg">{backup}</p>
                <button
                  className="ml-auto p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                  onClick={() => handleDownloadBackup(backup)}
                >
                  Download
                </button>
                <button
                  className="ml-2 p-2 rounded-lg sm:text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                  onClick={() => handleOpenLoadBackup(backup)}
                >
                  Load
                </button>
                <button
                  className="ml-2 p-2 rounded-lg sm:text-lg font-bold text-center bg-red-500 hover:bg-red-600"
                  onClick={() => handleDeleteBackup(backup)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
