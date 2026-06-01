import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import axios, { type AxiosProgressEvent } from "axios";

export default function UploadFile({
  setReload,
}: {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [state, setState] = useState<"idle" | "uploading" | "success">("idle");

  const handleUpload = async () => {
    if (!file) return;
    if (!file.name.endsWith(".dump")) {
      setError("Invalid file type. Please upload a valid backup file.");
      return;
    }
    setError(null);
    try {
      setState("uploading");
      const formData = new FormData();
      formData.append("backupFile", file);
      const apiUrl = window.location.origin;
      const uploadUrl = `${apiUrl}/api/backup/upload`;
      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
          }
        },
      });
      console.log("Upload successful");
      setState("success");
    } catch (error) {
      setError("Failed to upload file.");
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h2 className="text-lg font-semibold mb-2 capitalize">Backup upload</h2>
      <input
        type="file"
        accept={".application/octet-stream,.dump"}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }}
        className="mb-4 bg-surface-a2 p-2"
      />
      {state === "idle" && (
        <div className="flex">
          <button
            onClick={handleUpload}
            className="w-1/2 bg-primary-a0 hover:bg-primary-a1 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            disabled={!file}
          >
            Upload
          </button>
          <button
            onClick={closeOverlay}
            className="w-1/2 bg-surface-a2 hover:bg-surface-a3 text-white font-medium p-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}
      {state === "uploading" && (
        <div className="w-full bg-surface-a2 rounded-full h-4 mt-2">
          <div
            className="bg-primary-a0 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-sm text-center mt-1">{progress}%</p>
        </div>
      )}
      {state === "success" && (
        <div className="flex flex-col items-center">
          <p className="text-green-500 font-medium">Upload successful!</p>
          <button
            onClick={() => {
              closeOverlay();
              setReload((prev) => !prev);
            }}
            className="mt-4 bg-primary-a0 hover:bg-primary-a1 text-white font-medium py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
