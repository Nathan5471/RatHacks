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

export const getAllEvents = async () => {
  const response = await api.get("/all");
  return response.data;
};

export const organizerGetAllEvents = async () => {
  const response = await api.get("/organizerAll");
  return response.data;
};
