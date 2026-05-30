import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import axios, { type AxiosProgressEvent } from "axios";
import { generateUploadLink } from "../utils/ProjectAPIHandler";

export default function UploadFile({ fileType, setFileURL }: { fileType: "screenshot" | "video", setFileURL: (url: string) => void }) {
    const { closeOverlay } = useOverlay();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [state, setState] = useState<"idle" | "uploading" | "success">("idle");

    const handleUpload = async () => {
        if (!file) return;
        if (fileType === "screenshot" && !["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type)) {
            setError("Invalid file type. Please upload a PNG, JPG, JPEG, or WebP image.");
            return;
        }
        if (fileType === "video" && !["video/mp4", "video/webm"].includes(file.type)) {
            setError("Invalid file type. Please upload an MP4 or WebM video.");
            return;
        }
        if (fileType === "screenshot" && file.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            return;
        }
        if (fileType === "video" && file.size > 25 * 1024 * 1024) {
            setError("File size exceeds 25MB limit.");
            return;
        }
        setError(null);
        try {
            const fileExtension = file.name.split(".").pop() || "";
            const { uploadURL, postUploadURL } = await generateUploadLink(fileExtension) as { uploadURL: string, postUploadURL: string };
            console.log("Generated upload URL:", uploadURL);
            console.log("Generated file URL:", postUploadURL);
            setState("uploading");
            await axios.put(uploadURL, file, {
                headers: {
                    "Content-Type": file.type,
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }
            });
            setFileURL(postUploadURL);
            setState("success");
        } catch (error) {
            setError("Failed to upload file.");
        }
    };

    return (
        <div className="flex flex-col w-80">
            <h2 className="text-lg font-semibold mb-2 capitalize">{fileType} upload</h2>
            <input
                type="file"
                accept={fileType === "screenshot" ? "image/png, image/jpg, image/jpeg, image/webp" : "video/mp4, video/webm"}
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
                <div
                    className="w-full bg-surface-a2 rounded-full h-4 mt-2"
                >
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
                        onClick={closeOverlay}
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