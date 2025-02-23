import logo from "../assets/logo-copy.svg";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center bg-cover bg-no-repeat bg-center w-screen overflow-x-hidden">
    <header className="flex items-center whitespace-nowrap max-w-screen justify-between px-6 py-4">
      <div className="text-2xl w-5xl font-bold text-white">
        <img src={logo} className="h-16 w-auto"></img>
      </div>
      <nav className="space-x-6 flex items-center">
        <Link to="/browse" className="text-gray-300 hover:text-white">
          Products
        </Link>
        <Link to="/about" className="text-gray-300 hover:text-white">
          About
        </Link>
        <span className="text-gray-300">|</span>
        <Link to="/login" className="text-gray-300 hover:text-white">
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-100 text-white rounded-lg hover:bg-blue-300"
        >
          Signup
        </Link>
      </nav>
    </header>

    <main className="flex-grow w-full bg-no-repeat bg-cover flex bg-[url(./assets/hero-bg.png)] items-center justify-between px-12">
      <div className="w-5xl mx-auto">
        <h1 className="text-gray-800 text-5xl font-bold leading-tight">
          Manage Your Library Like Never Before
        </h1>
        <p className="mt-4 text-lg text-gray-800">
          Streamline your library&#39;s operations with secure, user-friendly
          tools designed for both admins and readers.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-100 text-black font-semibold rounded-lg hover:bg-blue-300"
          >
            Get Started
          </Link>
          <Link
            to="/browse"
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
          >
            Explore Books
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default Home;
