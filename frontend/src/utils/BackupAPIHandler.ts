import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/backup`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" },
    );
  },
);

export const generateBackup = async () => {
  const response = await api.post("/generate");
  return response.data;
};

export const loadBackup = async (backupName: string) => {
  const response = await api.post("/load", { backupName });
  return response.data;
};

export const uploadBackup = async (backupFile: File) => {
  const formData = new FormData();
  formData.append("backupFile", backupFile);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllBackups = async () => {
  const response = await api.get("/backups");
  return response.data;
};

export const downloadBackup = async (backupName: string) => {
  const response = await api.get(`/${backupName}`, {
    responseType: "blob",
  });
  return response.data; // Returns the file, doesn't download it directly
};

export const deleteBackup = async (backupName: string) => {
  const response = await api.delete(`/${backupName}`);
  return response.data;
};
