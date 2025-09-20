import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const OrganizerRoute: React.FC = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.accountType !== "organizer") {
    return <Navigate to="/app" />;
  } else {
    return <Outlet />;
  }
};

export default OrganizerRoute;
