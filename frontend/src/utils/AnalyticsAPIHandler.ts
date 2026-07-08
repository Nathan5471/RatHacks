import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/analytics`,
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

export const trackUrl = async (url: string) => {
  const response = await api.post("/trackUrl", { url });
  return response.data;
};

export const sendHeartbeat = async () => {
  const response = await api.post(
    "/heartbeat",
    {},
    {
      // Makes sure the request is sent even if the user closes the page
      adapter: "fetch",
      fetchOptions: {
        keepalive: true,
      },
    },
  );
  return response.data;
};

export const getDayAnalytics = async (date: string) => {
  const response = await api.get(`/day/${date}`);
  return response.data;
};

export const getWeekAnalytics = async (startDate: string) => {
  const response = await api.get(`/week/${startDate}`);
  return response.data;
};

export const getCustomRangeAnalytics = async (
  startDate: string,
  endDate: string,
) => {
  const response = await api.get(`/custom-range/${startDate}/${endDate}`);
  return response.data;
};

export const getAllAnalytics = async () => {
  const response = await api.get(`/all`);
  return response.data;
};

export const getUserSessions = async (userId: string) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const getDeviceSessions = async (deviceId: string) => {
  const response = await api.get(`/device/${deviceId}`);
  return response.data;
};
