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
  contactFirstName: string;
  contactLastName: string;
  contactRelationship: string;
  contactPhoneNumber: string;
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

export const resetPassword = async (email: string) => {
  const response = await api.post("/reset-password", { email });
  return response.data;
};

export const setNewPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const response = await api.post("/set-new-password", {
    email,
    token,
    newPassword,
  });
  return response.data;
};

export const inviteOrganizer = async (email: string) => {
  const response = await api.post(`/invite/organizer/${email}`);
  return response.data;
};

export const registerOrganizer = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
}) => {
  const response = await api.post("/organizer/register", userData);
  return response.data;
};

export const inviteJudge = async (email: string) => {
  const response = await api.post(`/invite/judge/${email}`);
  return response.data;
};

export const registerJudge = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
}) => {
  const response = await api.post("/judge/register", userData);
  return response.data;
};

export const cancelInvite = async (email: string) => {
  const response = await api.post("/cancel-invite", { email });
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

export const checkResetPassword = async (email: string, token: string) => {
  const response = await api.get("/check/reset-password", {
    params: { email, token },
  });
  return response.data;
};

export const checkOrganizerInvite = async (email: string, token: string) => {
  const response = await api.get("/check/invite/organizer", {
    params: { email, token },
  });
  return response.data;
};

export const checkJudgeInvite = async (email: string, token: string) => {
  const response = await api.get("/check/invite/judge", {
    params: { email, token },
  });
  return response.data;
};

export const getInvites = async () => {
  const response = await api.get("/invites");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/current-user");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/all");
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
  contactFirstName: string;
  contactLastName: string;
  contactRelationship: string;
  contactPhoneNumber: string;
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

export const updateTheme = async (
  theme: "default" | "spooky" | "space" | "framework"
) => {
  const response = await api.put("/update-theme", {
    theme,
  });
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/delete");
  return response.data;
};
