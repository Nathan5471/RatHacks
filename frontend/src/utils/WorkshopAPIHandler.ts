import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/workshop`,
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

export const createWorkshop = async (
  data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/create", data, { signal });
  return response.data;
};

export const joinWorkshop = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/join/${id}`, {}, { signal });
  return response.data;
};

export const leaveWorkshop = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/leave/${id}`, {}, { signal });
  return response.data;
};

export const addGoogleMeetURL = async (
  id: string,
  googleMeetURL: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/add-google-meet-url/${id}`,
    {
      googleMeetURL,
    },
    { signal },
  );
  return response.data;
};

export const endWorkshop = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/end/${id}`, {}, { signal });
  return response.data;
};

export const updateWorkshop = async (
  id: string,
  data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.put(`/update/${id}`, data, { signal });
  return response.data;
};

export const getAllWorkshops = async (signal?: AbortSignal) => {
  const response = await api.get("/all", { signal });
  return response.data;
};

export const organizerGetAllWorkshops = async (signal?: AbortSignal) => {
  const response = await api.get("/organizer-all", { signal });
  return response.data;
};

export const getWorkshopById = async (id: string, signal?: AbortSignal) => {
  const response = await api.get(`/get/${id}`, { signal });
  return response.data;
};

export const organizerGetWorkshopById = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/organizer/${id}`, { signal });
  return response.data;
};

export const deleteWorkshop = async (id: string, signal?: AbortSignal) => {
  const response = await api.delete(`/delete/${id}`, { signal });
  return response.data;
};
