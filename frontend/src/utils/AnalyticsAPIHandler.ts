import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/analytics`,
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

export const trackUrl = async (url: string, signal?: AbortSignal) => {
  const response = await api.post("/trackUrl", { url }, { signal });
  return response.data;
};

export const sendHeartbeat = async (signal?: AbortSignal) => {
  const response = await api.post(
    "/heartbeat",
    {},
    {
      // Makes sure the request is sent even if the user closes the page
      adapter: "fetch",
      fetchOptions: {
        keepalive: true,
      },
      signal,
    },
  );
  return response.data;
};

export const getDayAnalytics = async (date: string, signal?: AbortSignal) => {
  const response = await api.get(`/day/${date}`, { signal });
  return response.data;
};

export const getWeekAnalytics = async (
  startDate: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/week/${startDate}`, { signal });
  return response.data;
};

export const getCustomRangeAnalytics = async (
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/custom/${startDate}/${endDate}`, { signal });
  return response.data;
};

export const getAllAnalytics = async (signal?: AbortSignal) => {
  const response = await api.get(`/all`, { signal });
  return response.data;
};

export const getSession = async (sessionId: string, signal?: AbortSignal) => {
  const response = await api.get(`/session/${sessionId}`, { signal });
  return response.data;
};

export const getUserSessions = async (userId: string, signal?: AbortSignal) => {
  const response = await api.get(`/user/${userId}`, { signal });
  return response.data;
};

export const getDeviceSessions = async (
  deviceId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/device/${deviceId}`, { signal });
  return response.data;
};
