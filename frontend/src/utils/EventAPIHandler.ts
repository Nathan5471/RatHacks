import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/event`,
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

export const createEvent = async (
  eventData: {
    name: string;
    type: "hackathon" | "ctf";
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/create", eventData, { signal });
  return response.data;
};

export const joinEvent = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.post(`/join/${eventId}`, {}, { signal });
  return response.data;
};

export const leaveEvent = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.post(`/leave/${eventId}`, {}, { signal });
  return response.data;
};

export const joinTeam = async (
  eventId: string,
  joinCode: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/join-team/${eventId}/${joinCode}`,
    {},
    { signal },
  );
  return response.data;
};

export const leaveTeam = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.post(`/leave-team/${eventId}`, {}, { signal });
  return response.data;
};

export const checkInUser = async (
  eventId: string,
  userId: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/check-in/${eventId}/${userId}`,
    {},
    { signal },
  );
  return response.data;
};

export const releaseJudging = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.post(
    `/release-judging/${eventId}`,
    {},
    { signal },
  );
  return response.data;
};

export const updateEvent = async (
  id: string,
  eventData: {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.put(`/update/${id}`, eventData, { signal });
  return response.data;
};

export const getAllEvents = async (signal?: AbortSignal) => {
  const response = await api.get("/all", { signal });
  return response.data;
};

export const organizerGetAllEvents = async (signal?: AbortSignal) => {
  const response = await api.get("/organizer-all", { signal });
  return response.data;
};

export const judgeGetAllEvents = async (signal?: AbortSignal) => {
  const response = await api.get("/judge-all", { signal });
  return response.data;
};

export const getEventById = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.get(`/get/${eventId}`, { signal });
  return response.data;
};

export const organizerGetEventById = async (
  eventId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/organizer/${eventId}`, { signal });
  return response.data;
};

export const organizerGetUserByEmail = async (
  email: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(
    `/organizer-user-by-email/${encodeURIComponent(email)}`,
    { signal },
  );
  return response.data;
};

export const judgeGetEventById = async (
  eventId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/judge/${eventId}`, { signal });
  return response.data;
};

export const deleteEvent = async (eventId: string, signal?: AbortSignal) => {
  const response = await api.delete(`/delete/${eventId}`, { signal });
  return response.data;
};
