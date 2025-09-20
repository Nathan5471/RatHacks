import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import OrganizerRoute from "./utils/OrganizerRoute";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Overlay from "./components/Overlay";

function App() {
  const { user, getUser } = useAuth();
  useEffect(() => {
    if (user === undefined) {
      getUser();
    }
  }, [user, getUser]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthenticatedRoute />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>
        <Route element={<OrganizerRoute />}>
          <Route path="/app/organizer" element={<OrganizerDashboard />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <Overlay />
    </Router>
  );
}

export default App;
