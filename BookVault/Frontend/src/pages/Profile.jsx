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
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
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

    // Check if new password is same as current
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword =
        "New password cannot be the same as your current password";
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

  // Handle delete account confirmation
  const toggleDeleteConfirm = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
    setDeletePassword("");
    setDeleteError("");
  };

  // Toggle delete password visibility
  const toggleDeletePasswordVisibility = () => {
    setShowDeletePassword(!showDeletePassword);
  };

  // Handle delete account submission
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm account deletion");
      return;
    }

    setDeleteLoading(true);

    try {
      // You'll need to implement this endpoint in your backend
      await axios.post(
        "/auth/delete-account",
        {
          password: deletePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Clear localStorage and redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", {
        state: { message: "Your account has been successfully deleted" },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "Failed to delete account. Please try again.";
      setDeleteError(errorMsg);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="lg:col-span-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-indigo-300">{user.email}</p>
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm ${
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
            <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Change Password
              </h2>

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
                  <div className="relative">
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword.currentPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                  <div className="relative">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword.newPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {validationErrors.newPassword}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-indigo-300">
                    Must be at least 8 characters with uppercase, lowercase,
                    number and special character.
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-indigo-200 mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword.confirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
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

            {/* Delete Account Section */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 shadow-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Account Actions
              </h2>

              <div className="space-y-6">
                {!showDeleteConfirm ? (
                  <div>
                    <p className="text-red-300 mb-4">
                      Deleting your account will permanently remove all your
                      data and cannot be undone.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleDeleteConfirm}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-bold text-red-400 mb-2">
                        Are you sure?
                      </h3>
                      <p className="text-red-300 text-sm">
                        This action cannot be undone. All your data will be
                        permanently deleted.
                      </p>
                    </div>

                    {deleteError && (
                      <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                        {deleteError}
                      </div>
                    )}

                    <form onSubmit={handleDeleteAccount}>
                      <div className="mb-4">
                        <label
                          className="block text-indigo-200 mb-2"
                          htmlFor="deletePassword"
                        >
                          Enter your password to confirm
                        </label>
                        <div className="relative">
                          <input
                            type={showDeletePassword ? "text" : "password"}
                            id="deletePassword"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={toggleDeletePasswordVisibility}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-red-400 focus:outline-none"
                            aria-label="Toggle password visibility"
                          >
                            {showDeletePassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={toggleDeleteConfirm}
                          className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={deleteLoading}
                          className={`flex-1 py-3 px-4 ${
                            deleteLoading
                              ? "bg-red-700 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          } text-white font-medium rounded-lg transition-colors duration-200 flex justify-center items-center`}
                        >
                          {deleteLoading ? (
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
                              Deleting...
                            </>
                          ) : (
                            "Confirm Delete"
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
