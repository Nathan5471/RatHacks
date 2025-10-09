import { createContext, useState, useContext } from "react";
import { getCurrentUser } from "../utils/AuthAPIHandler";

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
  getUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(undefined);

  const getUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    setUser(undefined);
  };

  const contextValue = {
    user,
    getUser,
    logout,
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
