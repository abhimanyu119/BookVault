import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const debounceRef = useRef({});

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const debounceValidate = (field, value) => {
    clearTimeout(debounceRef.current[field]);
    debounceRef.current[field] = setTimeout(() => {
      validateField(field, value);
    }, 500);
  };

  const validateField = (field, value) => {
    let error = "";

    if (value.trim() !== "") {
      if (field === "email" && !emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
      if (field === "password" && !passwordRegex.test(value)) {
        error =
          "Password must be at least 8 characters with letters and numbers";
      }
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters with letters and numbers";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("/auth/login", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (response.status === 200) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Login failed";
      setError(errorMsg);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full flex items-center justify-center px-4 py-12">
      {/* Background with matching gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 -z-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12"></div>
      <div className="absolute bottom-1/4 -right-16 w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12"></div>

      {/* Floating book icon */}
      <div className="absolute top-20 right-[20%] opacity-10">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Form header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-4">
            <svg
              className="w-8 h-8 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-indigo-200 mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-indigo-200 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  debounceValidate("email", e.target.value);
                }}
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
              <div className="flex justify-between mb-2">
                <label className="text-indigo-200" htmlFor="password">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    debounceValidate("password", e.target.value);
                  }}
                  autoComplete="current-password"
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
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-indigo-300">
              Don&#39;t have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
