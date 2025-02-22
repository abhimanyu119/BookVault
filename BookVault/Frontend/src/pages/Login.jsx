import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@bookvault.com") {
      localStorage.setItem("token", "admin");
      navigate("/admin");
    } else {
      localStorage.setItem("token", "user");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-800">Login</h1>
      <p className="text-gray-600 mt-2">Access your account</p>
      <form
        className="mt-6 w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
        onSubmit={handleLogin}
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full p-3 border text-gray-900 border-gray-300 ring-gray-200 ring-2 rounded outline-none focus:ring-1 focus:ring-blue-600"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full p-3 border text-gray-900 border-gray-300 ring-gray-200 ring-2 rounded outline-none focus:ring-1 focus:ring-blue-600"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;