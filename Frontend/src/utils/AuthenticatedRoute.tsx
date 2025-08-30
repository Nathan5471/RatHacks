import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthenticatedRoute: React.FC = () => {
  const { user } = useAuth();
  if (user === undefined) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthenticatedRoute;
