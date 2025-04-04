import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-copy.svg";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const hideAuthButtons =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="w-full z-50 fixed top-2 flex justify-center items-center">
      <nav
        className={`w-11/12 max-w-6xl backdrop-blur-sm rounded-lg py-3 px-6 flex justify-between items-center z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/90 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-500/30"
            : "bg-gray-900/80 border border-gray-800/20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg
              className={`w-8 h-8 mr-2 transition-colors duration-300 ${
                scrolled ? "text-blue-400" : "text-white"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <image href={logo} x="0" y="0" height="24" width="24" />
            </svg>
            <span className="text-2xl text-gray-200 font-bold">BookVault</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-1 lg:space-x-6">
            <div className="relative group px-2">
              <button className="flex items-center text-gray-200 hover:text-white font-medium overflow-hidden text-ellipsis max-w-[80px] lg:max-w-none">
                <span className="truncate">Products</span>
                <svg
                  className="w-4 h-4 ml-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-800">
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  eBooks
                </Link>
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  Audiobooks
                </Link>
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  Library Management
                </Link>
              </div>
            </div>

            <div className="relative group px-2">
              <button className="flex items-center text-gray-200 hover:text-white font-medium overflow-hidden text-ellipsis max-w-[80px] lg:max-w-none">
                <span className="truncate">Company</span>
                <svg
                  className="w-4 h-4 ml-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-800">
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  About Us
                </Link>
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  Careers
                </Link>
                <Link
                  to="#"
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  Contact
                </Link>
              </div>
            </div>

            <Link
              to="#"
              className="px-2 text-gray-200 hover:text-white font-medium hover:underline underline-offset-4 decoration-blue-400 truncate max-w-[60px] lg:max-w-none"
            >
              Pricing
            </Link>
            <Link
              to="#"
              className="px-2 text-gray-200 hover:text-white font-medium hover:underline underline-offset-4 decoration-blue-400 truncate max-w-[100px] lg:max-w-none"
            >
              For Librarians
            </Link>
          </div>
        </div>

        {/* Auth Buttons */}
        {!hideAuthButtons && (
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className={`rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                scrolled
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              }`}
            >
              Get started
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-200 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 rounded-lg shadow-lg py-4 md:hidden border border-gray-800">
            <div className="flex flex-col space-y-3 px-6">
              <button className="flex items-center justify-between text-gray-200 hover:text-white py-2">
                Products
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <button className="flex items-center justify-between text-gray-200 hover:text-white py-2">
                Company
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <Link to="#" className="text-gray-200 hover:text-white py-2">
                Pricing
              </Link>
              <Link to="#" className="text-gray-200 hover:text-white py-2">
                For Librarians
              </Link>

              {!hideAuthButtons && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-200 hover:text-white py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className={`rounded-lg px-4 py-2 font-medium text-center ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
