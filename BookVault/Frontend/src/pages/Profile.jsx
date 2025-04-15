import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form validation and UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        role: parsedUser.role || "user",
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Clear global messages when user makes changes
    if (error) setError("");
    if (success) setSuccess("");
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(
        passwordForm.newPassword
      )
    ) {
      errors.newPassword =
        "Password must include uppercase, lowercase, number and special character";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password update submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // Validate form
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    try {
      // You'll need to implement this endpoint in your backend
      await axios.post(
        "/auth/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Clear form on success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password updated successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Failed to update password. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 pt-28 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

        {/* User Info Card */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-indigo-300">{user.email}</p>
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.role === "admin"
                      ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                      : "bg-blue-900/50 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {user.role === "admin" ? "Administrator" : "Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-indigo-200 mb-2"
                htmlFor="currentPassword"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {validationErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-indigo-200 mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.newPassword}
                </p>
              )}
              <p className="mt-1 text-xs text-indigo-300">
                Must be at least 8 characters with uppercase, lowercase, number
                and special character.
              </p>
            </div>

            <div className="mb-6">
              <label
                className="block text-indigo-200 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${
                loading
                  ? "bg-indigo-700 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-medium rounded-lg transition-colors duration-200 flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Update Password"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
