import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/email`,
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

export const createEmail = async (data: {
  name: string;
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

export const addGoogleMeetURL = async (id: string, googleMeetURL: string) => {
  const response = await api.post(`/add-google-meet-url/${id}`, {
    googleMeetURL,
  });
  return response.data;
};

export const endWorkshop = async (id: string) => {
  const response = await api.post(`/end/${id}`);
  return response.data;
};

export const updateWorkshop = async (
  id: string,
  data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }
) => {
  const response = await api.put(`/update/${id}`, data);
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

export const deleteWorkshop = async (id: string) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};
