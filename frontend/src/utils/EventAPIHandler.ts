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
      error.response ? error.response.data : { message: "Network Error" }
    );
  }
);

export const createEvent = async (eventData: {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
}) => {
  const response = await api.post("/create", eventData);
  return response.data;
};

export const joinEvent = async (eventId: string) => {
  const response = await api.post(`/join/${eventId}`);
  return response.data;
};

export const leaveEvent = async (eventId: string) => {
  const response = await api.post(`/leave/${eventId}`);
  return response.data;
};

export const joinTeam = async (eventId: string, joinCode: string) => {
  const response = await api.post(`/join-team/${eventId}/${joinCode}`);
  return response.data;
};

export const leaveTeam = async (eventId: string) => {
  const response = await api.post(`/leave-team/${eventId}`);
  return response.data;
};

export const checkInUser = async (eventId: string, userId: string) => {
  const response = await api.post(`/check-in/${eventId}/${userId}`);
  return response.data;
};

export const releaseJudging = async (eventId: string) => {
  const response = await api.post(`/release-judging/${eventId}`);
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
  }
) => {
  const response = await api.put(`/update/${id}`, eventData);
  return response.data;
};

export const getAllEvents = async () => {
  const response = await api.get("/all");
  return response.data;
};

export const organizerGetAllEvents = async () => {
  const response = await api.get("/organizer-all");
  return response.data;
};

export const judgeGetAllEvents = async () => {
  const response = await api.get("/judge-all");
  return response.data;
};

export const getEventById = async (eventId: string) => {
  const response = await api.get(`/get/${eventId}`);
  return response.data;
};

export const organizerGetEventById = async (eventId: string) => {
  const response = await api.get(`/organizer/${eventId}`);
  return response.data;
};

export const organizerGetUserByEmail = async (email: string) => {
  const response = await api.get(
    `/organizer-user-by-email/${encodeURIComponent(email)}`
  );
  return response.data;
};

export const judgeGetEventById = async (eventId: string) => {
  const response = await api.get(`/judge/${eventId}`);
  return response.data;
};

export const deleteEvent = async (eventId: string) => {
  const response = await api.delete(`/delete/${eventId}`);
  return response.data;
};
