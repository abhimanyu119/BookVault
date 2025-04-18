import { useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import axios from "../api/axios";
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
  const [showPassword, setShowPassword] = useState(false);
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

      const response = await axios.post("/auth/signup", signupData);
      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
      }

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Signup failed";
      setError(errorMsg);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 pt-24"
      style={{
        backgroundImage: `url(${illustration})`,
        backgroundSize: "cover",
        backgroundPosition: "center calc(50% + 2rem)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br bg-[#0B0C2A] -z-10"></div>
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
                placeholder="John Doe"
                autoComplete="name"
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
                placeholder="you@example.com"
                autoComplete="email"
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
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
              <p className="mt-1 text-xs text-indigo-300">
                Must be at least 8 characters with letters and numbers
              </p>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showPassword ? (
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

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-indigo-300">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
