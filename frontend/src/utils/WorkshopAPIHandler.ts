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
      error.response ? error.response.data : { message: "Network Error" }
    );
  }
);

export const createWorkshop = async (data: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}) => {
  const response = await api.post("/create", data);
  return response.data;
};

export const joinWorkshop = async (id: string) => {
  const response = await api.post(`/join/${id}`);
  return response.data;
};

export const leaveWorkshop = async (id: string) => {
  const response = await api.post(`/leave/${id}`);
  return response.data;
};

export const getAllWorkshops = async () => {
  const response = await api.get("/all");
  return response.data;
};

export const organizerGetAllWorkshops = async () => {
  const response = await api.get("/organizer-all");
  return response.data;
};

export const getWorkshopById = async (id: string) => {
  const response = await api.get(`/get/${id}`);
  return response.data;
};

export const organizerGetWorkshopById = async (id: string) => {
  const response = await api.get(`/organizer/${id}`);
  return response.data;
};
