import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const AuthenticatedRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthenticatedRoute;
