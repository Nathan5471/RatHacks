import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/auth`,
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

export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const verifyEmail = async (email: string, token: string) => {
  const response = await api.post("/verify-email", null, {
    params: { email, token },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/current-user");
  return response.data;
};
