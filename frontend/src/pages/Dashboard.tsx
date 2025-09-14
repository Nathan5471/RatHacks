import { useAuth } from "../contexts/AuthContext";
import AppNavbar from "../components/AppNavbar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <AppNavbar />
      </div>
    </div>
  );
}
