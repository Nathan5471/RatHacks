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

export const createEmail = async (
  data: {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/create", data, { signal });
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
  signal?: AbortSignal,
) => {
  const response = await api.put(`/update/${id}`, data, { signal });
  return response.data;
};

export const getAllEmails = async (signal?: AbortSignal) => {
  const response = await api.get("/all", { signal });
  return response.data;
};

export const organizerGetAllEmails = async (signal?: AbortSignal) => {
  const response = await api.get("/organizer-all", { signal });
  return response.data;
};

export const getEmailById = async (id: string, signal?: AbortSignal) => {
  const response = await api.get(`/get/${id}`, { signal });
  return response.data;
};

export const organizerGetEmailById = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/organizer/${id}`, { signal });
  return response.data;
};

export const deleteEmail = async (id: string, signal?: AbortSignal) => {
  const response = await api.delete(`/delete/${id}`, { signal });
  return response.data;
};

export const sendEmail = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/send-email/${id}`, {}, { signal });
  return response.data;
};

export const sendEmailToCustomRecipients = async (
  id: string,
  recipients: { email: string; firstName: string; lastName: string }[],
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/send-email/${id}/customRecipients`,
    {
      recipients,
    },
    { signal },
  );
  return response.data;
};

export const sendTestEmail = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/send-test/${id}`, {}, { signal });
  return response.data;
};

export const activateEmail = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/activate/${id}`, {}, { signal });
  return response.data;
};

export const deactivateEmail = async (id: string, signal?: AbortSignal) => {
  const response = await api.post(`/deactivate/${id}`, {}, { signal });
  return response.data;
};

export const getAllRecipients = async (signal?: AbortSignal) => {
  const response = await api.get("/receipient-all", { signal });
  return response.data;
};

export const getRecipientsByEvent = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/receipient-by-event/${id}`, { signal });
  return response.data;
};

export const getRecipientsByWorkshop = async (
  id: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/receipient-by-workshop/${id}`, { signal });
  return response.data;
};

export const getRecipientsByFilter = async (
  filter: string,
  id: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/receipient-by-filter/${filter}/${id}`, {
    signal,
  });
  return response.data;
};
