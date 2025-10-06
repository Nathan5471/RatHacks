import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import OrganizerRoute from "./utils/OrganizerRoute";
import Dashboard from "./pages/Dashboard";
import Workshops from "./pages/Workshops";
import Workshop from "./pages/Workshop";
import Events from "./pages/Events";
import Event from "./pages/Event";
import EventSubmit from "./pages/EventSubmit";
import Settings from "./pages/Settings";
import OrganizerDashboard from "./pages/organizerPages/OrganizerDashboard";
import OrganizerUsers from "./pages/organizerPages/OrganizerUsers";
import OrganizerWorkshops from "./pages/organizerPages/OrganizerWorkshops";
import OrganizerWorkshop from "./pages/organizerPages/OrganizerWorkshop";
import OrganizerEvents from "./pages/organizerPages/OrganizerEvents";
import OrganizerEvent from "./pages/organizerPages/OrganizerEvent";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import OrganizerRegister from "./pages/organizerPages/OrganizerRegister";
import JudgeRegister from "./pages/judgePages/JudgeRegister";
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
          <Route path="/app/workshops" element={<Workshops />} />
          <Route path="/app/workshop/:workshopId" element={<Workshop />} />
          <Route path="/app/events" element={<Events />} />
          <Route path="/app/event/:eventId" element={<Event />} />
          <Route path="/app/event/submit/:eventId" element={<EventSubmit />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>
        <Route element={<OrganizerRoute />}>
          <Route path="/app/organizer" element={<OrganizerDashboard />} />
          <Route path="/app/organizer/users" element={<OrganizerUsers />} />
          <Route
            path="/app/organizer/workshops"
            element={<OrganizerWorkshops />}
          />
          <Route
            path="/app/organizer/workshop/:workshopId"
            element={<OrganizerWorkshop />}
          />
          <Route path="/app/organizer/events" element={<OrganizerEvents />} />
          <Route
            path="/app/organizer/event/:eventId"
            element={<OrganizerEvent />}
          />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/invite/organizer" element={<OrganizerRegister />} />
        <Route path="/invite/judge" element={<JudgeRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      <Overlay />
    </Router>
  );
}

export default App;
