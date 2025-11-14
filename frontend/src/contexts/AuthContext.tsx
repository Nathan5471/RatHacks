import { createContext, useState, useContext } from "react";
import { getCurrentUser, updateTheme } from "../utils/AuthAPIHandler";

interface AuthContextType {
  user:
    | {
        id: string;
        email: string;
        emailVerified: boolean;
        accountType: "student" | "organizer" | "judge";
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
        events: string[];
        workshops: string[];
      }
    | null
    | undefined;
  theme: "default" | "spooky" | "space";
  getUser: () => void;
  logout: () => void;
  handleUpdateTheme: (theme: "default" | "spooky" | "space") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);
  const [theme, setTheme] = useState<AuthContextType["theme"]>("default");

  const getUser = async () => {
    try {
      const theme = localStorage.getItem("theme") as AuthContextType["theme"];
      if (theme) {
        setTheme(theme);
        if (theme !== "default") {
          document.documentElement.classList.add(theme);
        }
      } else {
        setTheme("default");
      }
      const userData = await getCurrentUser();
      setUser(userData);
      if (userData.theme) {
        document.documentElement.classList.remove("spooky");
        document.documentElement.classList.remove("space");
        if (userData.theme !== "default") {
          document.documentElement.classList.add(userData.theme);
        }
        setTheme(userData.theme as AuthContextType["theme"]);
        localStorage.setItem("theme", userData.theme);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    }
  };

  const logout = () => {
    setUser(undefined);
  };

  const handleUpdateTheme = async (theme: AuthContextType["theme"]) => {
    document.documentElement.classList.remove("spooky");
    document.documentElement.classList.remove("space");
    if (theme !== "default") {
      document.documentElement.classList.add(theme);
    }
    setTheme(theme);
    localStorage.setItem("theme", theme);
    try {
      await updateTheme(theme);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const contextValue = {
    user,
    theme,
    getUser,
    logout,
    handleUpdateTheme,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
