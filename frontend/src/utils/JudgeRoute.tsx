import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const JudgeRoute: React.FC = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.accountType !== "judge") {
    return <Navigate to="/app" />;
  } else {
    return <Outlet />;
  }
};

export default JudgeRoute;
