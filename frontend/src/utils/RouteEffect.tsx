import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackUrl } from "./AnalyticsAPIHandler";

export default function RouteEffect() {
  const location = useLocation();

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

    trackUrl(location.pathname).catch((error) => {
      console.error("Error tracking URL:", error);
    });
  }, [location]);

  return null;
}
