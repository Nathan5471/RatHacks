import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/project`,
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

export const createProject = async (
  projectData: {
    name: string;
    description: string;
    codeURL: string;
    demoURL: string;
    screenshotURL: string;
    videoURL: string;
    eventId: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/create", projectData, { signal });
  return response.data;
};

export const submitProject = async (
  projectId: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(`/submit/${projectId}`, {}, { signal });
  return response.data;
};

export const judgeProject = async (
  projectId: string,
  feedback: {
    creativityScore: number;
    functionalityScore: number;
    technicalityScore: number;
    interfaceScore: number;
    feedback: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post(`/feedback/${projectId}`, feedback, {
    signal,
  });
  return response.data;
};

export const updateProject = async (
  projectId: string,
  projectData: {
    name: string;
    description: string;
    codeURL: string;
    demoURL: string;
    screenshotURL: string;
    videoURL: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.put(`/update/${projectId}`, projectData, {
    signal,
  });
  return response.data;
};

export const generateUploadLink = async (
  fileExtension: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/uploadLink/${fileExtension}`, { signal });
  return response.data;
};

export const getProjectById = async (
  projectId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/get/${projectId}`, { signal });
  return response.data;
};

export const organizerGetProjectById = async (
  projectId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/organizer/${projectId}`, { signal });
  return response.data;
};

export const judgeGetProjectById = async (
  projectId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/judge/${projectId}`, { signal });
  return response.data;
};
