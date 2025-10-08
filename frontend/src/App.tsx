import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import OrganizerRoute from "./utils/OrganizerRoute";
import JudgeRoute from "./utils/JudgeRoute";
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
import JudgeDashboard from "./pages/judgePages/JudgeDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import OrganizerRegister from "./pages/organizerPages/OrganizerRegister";
import JudgeRegister from "./pages/judgePages/JudgeRegister";
import VerifyEmail from "./pages/VerifyEmail";
import Overlay from "./components/Overlay";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _mtm?: any[];
  }
}

function App() {
  const { user, getUser } = useAuth();
  const location = useLocation();
  useEffect(() => {
    if (user === undefined) {
      getUser();
    }
  }, [user, getUser]);

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      "/": "Rat Hacks",
      "/login": "Rat Hacks | Login",
      "/register": "Rat Hacks | Register",
      "/reset-password": "Rat Hacks | Reset Password",
      "/invite/organizer": "Rat Hacks | Organizer Invitation",
      "/invite/judge": "Rat Hacks | Judge Invitation",
      "/verify-email": "Rat Hacks | Verify Email",
      "/app": "Rat Hacks | Dashboard",
      "/app/workshops": "Rat Hacks | Workshops",
      "/app/workshop/": "Rat Hacks | Workshop",
      "/app/events": "Rat Hacks | Events",
      "/app/event/": "Rat Hacks | Event",
      "/app/event/submit/": "Rat Hacks | Submit to Event",
      "/app/settings": "Rat Hacks | Settings",
      "/app/organizer": "Rat Hacks | Organizer Dashboard",
      "/app/organizer/users": "Rat Hacks | Organizer Users",
      "/app/organizer/workshops": "Rat Hacks | Organizer Workshops",
      "/app/organizer/workshop/": "Rat Hacks | Organizer Workshop",
      "/app/organizer/events": "Rat Hacks | Organizer Events",
      "/app/organizer/event/": "Rat Hacks | Organizer Event",
    };
    let title = "Rat Hacks";
    if (location.pathname.includes("/app/workshop/")) {
      title = routeTitles["/app/workshop/"];
    } else if (location.pathname.includes("/app/event/submit/")) {
      title = routeTitles["/app/event/submit/"];
    } else if (location.pathname.includes("/app/event/")) {
      title = routeTitles["/app/event/"];
    } else if (location.pathname.includes("/app/organizer/workshop/")) {
      title = routeTitles["/app/organizer/workshop/"];
    } else if (location.pathname.includes("/app/organizer/event/")) {
      title = routeTitles["/app/organizer/event/"];
    } else {
      title = routeTitles[location.pathname] || "Rat Hacks";
    }
    document.title = title;

    if (window._mtm) {
      window._mtm.push({
        event: "pageView",
        pageTitle: title,
        pageUrl: window.location.href,
      });
    }
  }, [location]);

  useEffect(() => {
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://matomo.rathacks.com/js/container_Ck8sMDR5.js";
    document
      .getElementsByTagName("script")[0]
      .parentNode?.insertBefore(g, null);
  }, []);

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
        <Route element={<JudgeRoute />}>
          <Route path="/app/judge" element={<JudgeDashboard />} />
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
