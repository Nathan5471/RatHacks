import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { OverlayProvider } from "./contexts/OverlayContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <OverlayProvider>
        <App />
      </OverlayProvider>
    </AuthProvider>
  </StrictMode>
);
