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
      error.response ? error.response.data : { message: "Network Error" },
    );
  },
);

export const createEmail = async (data: {
  name: string;
  messageSubject: string;
  messageBody: string;
  sendAll: boolean;
  filterBy: string | null;
  subFilterBy: string | null;
  sendOnJoin: boolean | null;
}) => {
  const response = await api.post("/create", data);
  return response.data;
};

export const updateEmail = async (
  id: string,
  data: {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
  },
) => {
  const response = await api.put(`/update/${id}`, data);
  return response.data;
};

export const getAllEmails = async () => {
  const response = await api.get("/all");
  return response.data;
};

export const organizerGetAllEmails = async () => {
  const response = await api.get("/organizer-all");
  return response.data;
};

export const getEmailById = async (id: string) => {
  const response = await api.get(`/get/${id}`);
  return response.data;
};

export const organizerGetEmailById = async (id: string) => {
  const response = await api.get(`/organizer/${id}`);
  return response.data;
};

export const deleteEmail = async (id: string) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};

export const sendEmail = async (id: string) => {
  const response = await api.post(`/send-email/${id}`);
  return response.data;
};

export const sendTestEmail = async (id: string) => {
  const response = await api.post(`/send-test/${id}`);
  return response.data;
};

export const activateEmail = async (id: string) => {
  const response = await api.post(`/activate/${id}`);
  return response.data;
};

export const deactivateEmail = async (id: string) => {
  const response = await api.post(`/deactivate/${id}`);
  return response.data;
};

export const getAllRecipients = async () => {
  const response = await api.get("/receipient-all");
  return response.data;
};

export const getRecipientsByEvent = async (id: string) => {
  const response = await api.get(`/receipient-by-event/${id}`);
  return response.data;
};

export const getRecipientsByWorkshop = async (id: string) => {
  const response = await api.get(`/receipient-by-workshop/${id}`);
  return response.data;
};

export const getRecipientsByFilter = async (filter: string, id: string) => {
  const response = await api.get(`/receipient-by-filter/${filter}/${id}`);
  return response.data;
};
