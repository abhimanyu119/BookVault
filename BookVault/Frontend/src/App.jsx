// App.jsx
import PropTypes from "prop-types";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import AdminCentre from "./pages/AdminCentre";
import NotFound from "./pages/NotFound";
// import ProtectedRoute from ".";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { isAuthenticated } from "./utils/auth";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          {/* All these routes will have the navbar from Layout */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminCentre />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
