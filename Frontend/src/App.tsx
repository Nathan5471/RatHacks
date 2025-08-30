import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import Login from "./pages/Login";

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
          <Route path="/" element={<p>You are logged in!</p>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<p>Register Page</p>} />
      </Routes>
    </Router>
  );
}

export default App;
