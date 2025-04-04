import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/signup-illustration.png";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const debounceTimer = useRef(null);

  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => func(...args), delay);
    };
  };

  const validateField = (name, value) => {
    const errors = {};
    if (!value) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
      return;
    }
    if (name === "name") {
      if (!/^[A-Za-z]{2,}(?: [A-Za-z]+)*$/.test(value)) {
        errors.name =
          "Enter a valid name with at least 2 alphabetic characters";
      }
    }
    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Enter a valid email address";
      }
    }
    if (name === "password") {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        )
      ) {
        errors.password =
          "Password must be 8+ characters with upper, lower, number, and symbol";
      }
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    setValidationErrors((prev) => ({
      ...prev,
      [name]: errors[name] || null,
    }));
  };

  const debouncedValidateField = debounce(validateField, 500);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    debouncedValidateField(name, value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 py-24"
      style={{
        backgroundImage: `url(${illustration})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 -z-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 w-full max-w-5xl items-center">
        {/* Left Side */}
        <div className="text-center self-start mx-auto mt-[-1rem] md:text-left">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-indigo-200 text-center mt-2">
            Join our library community
          </p>
          <div className="mt-6"></div>
        </div>
        {/* Right Side (Form) */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-xl border border-indigo-900/30 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
              {success}
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-indigo-200 mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-indigo-200 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-indigo-200 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-indigo-200 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
