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
  schoolDivision: string;
  gradeLevel: "nine" | "ten" | "eleven" | "twelve";
  isGovSchool: boolean;
  techStack: string;
  previousHackathon: boolean;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhoneNumber: string;
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

export const resendVerificationEmail = async () => {
  const response = await api.post("/resend-verification");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post("/logout-all");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/current-user");
  return response.data;
};

export const updateUser = async (userData: {
  firstName: string;
  lastName: string;
  schoolDivision: string;
  gradeLevel: "nine" | "ten" | "eleven" | "twelve";
  isGovSchool: boolean;
  techStack: string;
  previousHackathon: boolean;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhoneNumber: string;
}) => {
  const response = await api.put("/update", userData);
  return response.data;
};

export const updatePassword = async (newPassword: string) => {
  const response = await api.put("/update-password", {
    newPassword,
  });
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/delete");
  return response.data;
};
