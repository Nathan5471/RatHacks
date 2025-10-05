import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/project`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" }
    );
  }
);

export const createProject = async (projectData: {
  name: string;
  description: string;
  codeURL: string;
  demoURL: string;
  screenshot?: File;
  video?: File;
  eventId: string;
}) => {
  const formData = new FormData();
  formData.append("name", projectData.name);
  formData.append("description", projectData.description);
  formData.append("codeURL", projectData.codeURL);
  formData.append("demoURL", projectData.demoURL);
  if (projectData.screenshot) {
    formData.append("screenshot", projectData.screenshot);
  }
  if (projectData.video) {
    formData.append("video", projectData.video);
  }
  formData.append("eventId", projectData.eventId);

  const response = await api.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const submitProject = async (projectId: string) => {
  const response = await api.post(`/submit/${projectId}`);
  return response.data;
};

export const updateProject = async (
  projectId: string,
  projectData: {
    name: string;
    description: string;
    codeURL: string;
    demoURL: string;
    screenshot?: File;
    video?: File;
  }
) => {
  const formData = new FormData();
  formData.append("name", projectData.name);
  formData.append("description", projectData.description);
  formData.append("codeURL", projectData.codeURL);
  formData.append("demoURL", projectData.demoURL);
  if (projectData.screenshot) {
    formData.append("screenshot", projectData.screenshot);
  }
  if (projectData.video) {
    formData.append("video", projectData.video);
  }

  const response = await api.put(`/update/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await api.get(`/get/${projectId}`);
  return response.data;
};
