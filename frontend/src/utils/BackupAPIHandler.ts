import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/backup`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" },
    );
  },
);

export const generateBackup = async (signal?: AbortSignal) => {
  const response = await api.post("/generate", {}, { signal });
  return response.data;
};

export const loadBackup = async (backupName: string, signal?: AbortSignal) => {
  const response = await api.post("/load", { backupName }, { signal });
  return response.data;
};

export const uploadBackup = async (backupFile: File, signal?: AbortSignal) => {
  const formData = new FormData();
  formData.append("backupFile", backupFile);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
  });
  return response.data;
};

export const getAllBackups = async (signal?: AbortSignal) => {
  const response = await api.get("/backups", { signal });
  return response.data;
};

export const downloadBackup = async (
  backupName: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/${backupName}`, {
    responseType: "blob",
    signal,
  });
  return response.data; // Returns the file, doesn't download it directly
};

export const deleteBackup = async (
  backupName: string,
  signal?: AbortSignal,
) => {
  const response = await api.delete(`/${backupName}`, { signal });
  return response.data;
};
