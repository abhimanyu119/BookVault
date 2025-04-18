import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo-copy.svg";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const githubUrl = "https://github.com/abhimanyu119/bookvault";

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  // Get user data from the "user" key in localStorage
  const getUserRole = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return "user";

    try {
      const parsedUser = JSON.parse(userData);
      return parsedUser.role === "admin" ? "admin" : "user";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return "user";
    }
  };

  const getUserName = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return "";

    try {
      const parsedUser = JSON.parse(userData);
      return parsedUser.name || "";
    } catch {
      return "";
    }
  };

  const isAdmin = getUserRole() === "admin";
  const userName = getUserName();

  // Check if on auth pages
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  // Current page path for active state
  const currentPath = location.pathname;

  // Handle click outside of user menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper function to determine active link styles
  const getLinkStyles = (path) => {
    const isActive = currentPath === path;

    return isActive
      ? "px-2 text-white font-medium underline underline-offset-4 decoration-blue-400 truncate max-w-[100px] lg:max-w-none"
      : "px-2 text-gray-200 hover:text-white font-medium hover:underline hover:underline-offset-4 hover:decoration-blue-400 truncate max-w-[100px] lg:max-w-none";
  };

  // Helper function for mobile link styles
  const getMobileLinkStyles = (path) => {
    const isActive = currentPath === path;

    return isActive
      ? "text-white font-medium py-2 underline underline-offset-4 decoration-blue-400"
      : "text-gray-200 hover:text-white py-2";
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // User dropdown animation variants
  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="w-full z-50 fixed top-2 flex justify-center items-center">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
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
            {/* Home link */}
            <Link to="/" className={getLinkStyles("/")}>
              Home
            </Link>

            {/* Always show Browse with active state */}
            <Link to="/browse" className={getLinkStyles("/browse")}>
              Browse
            </Link>

            {/* GitHub Docs link - always visible */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 text-gray-200 hover:text-white font-medium hover:underline hover:underline-offset-4 hover:decoration-blue-400 truncate max-w-[100px] lg:max-w-none flex items-center"
            >
              Documentation
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* Show Dashboard only when logged in with active state */}
            {isLoggedIn && (
              <Link to="/dashboard" className={getLinkStyles("/dashboard")}>
                Dashboard
              </Link>
            )}

            {/* Show Admin Center only when logged in as admin with active state */}
            {isLoggedIn && isAdmin && (
              <Link to="/admin" className={getLinkStyles("/admin")}>
                Admin Center
              </Link>
            )}
          </div>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            /* Logged in - show User Menu */
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-gray-200 hover:text-white px-4 py-2 rounded-md hover:bg-gray-800/50 transition-colors duration-200"
              >
                <span className="mr-2">{userName || "User"}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>

              {/* Dropdown menu with animation */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 px-3 border border-gray-800"
                  >
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-300 hover:text-white"
                    >
                      Profile
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-gray-300 hover:text-white hover:bg-red-600/20 rounded px-2"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Not logged in - show Login/Signup based on current page */
            <>
              {!isLoginPage && (
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white px-4 py-2 whitespace-nowrap rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  Log in
                </Link>
              )}

              {!isSignupPage && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className={`rounded-lg px-4 py-2 whitespace-nowrap font-medium transition-all duration-300 ${
                      scrolled
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  >
                    Get started
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
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
        </motion.button>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute top-full left-0 mt-2 w-full bg-gray-900 rounded-lg shadow-lg py-4 md:hidden border border-gray-800"
            >
              <div className="flex flex-col space-y-3 px-6">
                {/* Home link */}
                <Link to="/" className={getMobileLinkStyles("/")}>
                  Home
                </Link>

                {/* Always show Browse with active state */}
                <Link to="/browse" className={getMobileLinkStyles("/browse")}>
                  Browse
                </Link>

                {/* GitHub Docs link */}
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white py-2 flex items-center"
                >
                  Docs
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                {/* Show Dashboard only when logged in with active state */}
                {isLoggedIn && (
                  <Link
                    to="/dashboard"
                    className={getMobileLinkStyles("/dashboard")}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Show Admin Center only when logged in as admin with active state */}
                {isLoggedIn && isAdmin && (
                  <Link to="/admin" className={getMobileLinkStyles("/admin")}>
                    Admin Center
                  </Link>
                )}

                {/* Profile link when logged in */}
                {isLoggedIn && (
                  <Link
                    to="/profile"
                    className={getMobileLinkStyles("/profile")}
                  >
                    Profile
                  </Link>
                )}

                {/* Auth buttons - conditionally display */}
                {isLoggedIn ? (
                  /* Logged in - show Logout */
                  <button
                    onClick={handleLogout}
                    className="text-gray-200 hover:text-white py-2 text-left hover:bg-red-600 hover:px-2 hover:rounded-md"
                  >
                    Logout
                  </button>
                ) : (
                  /* Not logged in - show Login/Signup based on current page */
                  <>
                    {!isLoginPage && (
                      <Link
                        to="/login"
                        className="text-gray-200 hover:text-white py-2"
                      >
                        Log in
                      </Link>
                    )}

                    {!isSignupPage && (
                      <Link
                        to="/signup"
                        className={`rounded-lg px-4 py-2 font-medium text-center ${
                          scrolled
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-800 hover:bg-gray-700"
                        } text-white`}
                      >
                        Get started
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
