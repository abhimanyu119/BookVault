import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import AdminCentre from "./pages/AdminCentre";
import NotFound from "./pages/NotFound";
import { isAuthenticated } from "./utils/auth";

// Global animations CSS
const globalStyles = `
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeSlideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes wave {
  0% { transform: translateX(0); }
  50% { transform: translateX(-5%); }
  100% { transform: translateX(0); }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fadeSlideUp {
  animation: fadeSlideUp 1s ease-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-wave {
  animation: wave 10s ease-in-out infinite;
}

.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
`;

// Protected route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : children;
};

//Route Prop Validation
const RoutePropTypes = {
  children: PropTypes.node.isRequired,
};
ProtectedRoute.propTypes = RoutePropTypes;
PublicRoute.propTypes = RoutePropTypes;

function App() {
  // Add global styles when the component mounts
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      // Clean up
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* All these routes will have the navbar from Layout */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
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
