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
      error.response ? error.response.data : { message: "Network Error" },
    );
  },
);

export const register = async (
  userData: {
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
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/register", userData, { signal });
  return response.data;
};

export const login = async (
  credentials: {
    email: string;
    password: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/login", credentials, { signal });
  return response.data;
};

export const verifyEmail = async (
  email: string,
  token: string,
  signal?: AbortSignal,
) => {
  const response = await api.post("/verify-email", null, {
    params: { email, token },
    signal,
  });
  return response.data;
};

export const resendVerificationEmail = async (signal?: AbortSignal) => {
  const response = await api.post("/resend-verification", {}, { signal });
  return response.data;
};

export const resetPassword = async (email: string, signal?: AbortSignal) => {
  const response = await api.post("/reset-password", { email }, { signal });
  return response.data;
};

export const setNewPassword = async (
  email: string,
  token: string,
  newPassword: string,
  signal?: AbortSignal,
) => {
  const response = await api.post("/set-new-password", {
    email,
    token,
    newPassword,
    signal,
  });
  return response.data;
};

export const inviteOrganizer = async (email: string, signal?: AbortSignal) => {
  const response = await api.post(`/invite/organizer/${email}`, {}, { signal });
  return response.data;
};

export const registerOrganizer = async (
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/organizer/register", userData, { signal });
  return response.data;
};

export const inviteJudge = async (email: string, signal?: AbortSignal) => {
  const response = await api.post(`/invite/judge/${email}`, {}, { signal });
  return response.data;
};

export const registerJudge = async (
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  },
  signal?: AbortSignal,
) => {
  const response = await api.post("/judge/register", userData, { signal });
  return response.data;
};

export const cancelInvite = async (email: string, signal?: AbortSignal) => {
  const response = await api.post("/cancel-invite", { email }, { signal });
  return response.data;
};

export const logoutUser = async (signal?: AbortSignal) => {
  const response = await api.post("/logout", {}, { signal });
  return response.data;
};

export const logoutAll = async (signal?: AbortSignal) => {
  const response = await api.post("/logout-all", {}, { signal });
  return response.data;
};

export const checkResetPassword = async (
  email: string,
  token: string,
  signal?: AbortSignal,
) => {
  const response = await api.get("/check/reset-password", {
    params: { email, token },
    signal,
  });
  return response.data;
};

export const checkOrganizerInvite = async (
  email: string,
  token: string,
  signal?: AbortSignal,
) => {
  const response = await api.get("/check/invite/organizer", {
    params: { email, token },
    signal,
  });
  return response.data;
};

export const checkJudgeInvite = async (
  email: string,
  token: string,
  signal?: AbortSignal,
) => {
  const response = await api.get("/check/invite/judge", {
    params: { email, token },
    signal,
  });
  return response.data;
};

export const getInvites = async (signal?: AbortSignal) => {
  const response = await api.get("/invites", { signal });
  return response.data;
};

export const getCurrentUser = async (signal?: AbortSignal) => {
  const response = await api.get("/current-user", { signal });
  return response.data;
};

export const getAllUsers = async (signal?: AbortSignal) => {
  const response = await api.get("/all", { signal });
  return response.data;
};

export const getStats = async (signal?: AbortSignal) => {
  const response = await api.get("/stats", { signal });
  return response.data;
};

export const updateUser = async (
  userData: {
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
  },
  signal?: AbortSignal,
) => {
  const response = await api.put("/update", userData, { signal });
  return response.data;
};

export const updatePassword = async (
  newPassword: string,
  signal?: AbortSignal,
) => {
  const response = await api.put(
    "/update-password",
    {
      newPassword,
    },
    { signal },
  );
  return response.data;
};

export const updateTheme = async (
  theme: "default" | "spooky" | "space" | "framework",
  signal?: AbortSignal,
) => {
  const response = await api.put(
    "/update-theme",
    {
      theme,
    },
    { signal },
  );
  return response.data;
};

export const changeAccountType = async (
  id: string,
  newAccountType: "student" | "judge" | "organizer",
  signal?: AbortSignal,
) => {
  const response = await api.put(
    "/organizer/update-account-type",
    {
      id,
      accountType: newAccountType,
    },
    { signal },
  );
  return response.data;
};

export const deleteUser = async (signal?: AbortSignal) => {
  const response = await api.delete("/delete", { signal });
  return response.data;
};

export const organizerDeleteUser = async (
  userId: string,
  signal?: AbortSignal,
) => {
  const response = await api.delete(`/organizer/delete/${userId}`, { signal });
  return response.data;
};
