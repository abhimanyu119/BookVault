import { useEffect, useRef } from "react";
import logo from "../assets/logo-copy.svg";
const Home = () => {
  const headingRef = useRef(null);

  // Animation effect for heading on load
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.classList.add("animate-in");
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 pt-24">
      {/* Enhanced background with subtle book pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 -z-10"></div>

      {/* Abstract book shapes in the background */}
      <div className="absolute top-1/4 -left-20 w-64 h-80 bg-blue-500/5 rounded-md blur-2xl rotate-12"></div>
      <div className="absolute bottom-1/4 -right-16 w-72 h-96 bg-indigo-500/5 rounded-md blur-2xl -rotate-12"></div>
      <div className="absolute top-2/3 -left-40 w-80 h-72 bg-purple-500/5 rounded-md blur-2xl rotate-45"></div>

      {/* Floating book icons */}
      <div
        className="absolute top-20 right-[20%] opacity-10 animate-float"
        style={{ animationDelay: "0.5s" }}
      >
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

      <div
        className="absolute bottom-40 left-[15%] opacity-10 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 16V3H10C8.9 3 8 3.9 8 5V16"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 16H8C6.9 16 6 16.9 6 18V19H21V18C21 16.9 20.1 16 19 16Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className="absolute top-40 left-[25%] opacity-10 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        {/* Library badge with animated icon */}
        <div className="inline-block mb-4 px-5 py-2 bg-indigo-900/60 rounded-full backdrop-blur-sm border border-indigo-700/50 text-sm text-indigo-200 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3H9C9.55228 3 10 3.44772 10 4V20C10 20.5523 9.55228 21 9 21H8C7.44772 21 7 20.5523 7 20V4C7 3.44772 7.44772 3 8 3Z"
                fill="#A5B4FC"
              />
              <path
                d="M12 3H13C13.5523 3 14 3.44772 14 4V20C14 20.5523 13.5523 21 13 21H12C11.4477 21 11 20.5523 11 20V4C11 3.44772 11.4477 3 12 3Z"
                fill="#818CF8"
              />
              <path
                d="M16 3H17C17.5523 3 18 3.44772 18 4V20C18 20.5523 17.5523 21 17 21H16C15.4477 21 15 20.5523 15 20V4C15 3.44772 15.4477 3 16 3Z"
                fill="#6366F1"
              />
              <rect x="3" y="3" width="18" height="2" rx="1" fill="#C7D2FE" />
              <rect x="3" y="19" width="18" height="2" rx="1" fill="#C7D2FE" />
            </svg>
            <span>Modern Library Solutions</span>
          </div>
        </div>

        {/* Heading with library theme */}
        <div
          ref={headingRef}
          className="opacity-0 transition-all duration-1000 ease-out transform translate-y-10"
          style={{ animationDelay: "0.3s" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 leading-tight">
            Digital{" "}
            <span className="text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text">
              Library
            </span>{" "}
            Management
          </h1>
        </div>

        {/* Subheading with library-specific benefits */}
        <p
          className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fadeSlideUp"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          Organize your collection, streamline checkouts, and engage readers
          with powerful yet intuitive tools designed for modern libraries.
        </p>

        {/* Action buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 opacity-0 animate-fadeSlideUp"
          style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
        >
          <a
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-200 transform hover:scale-105 hover:shadow-indigo-500/30 relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute -inset-full top-0 block bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity group-hover:translate-x-full duration-500"></span>
          </a>
          <a
            href="/browse"
            className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-indigo-700/30 shadow-lg transition-all duration-200 transform hover:scale-105 hover:border-indigo-600"
          >
            Browse Catalog
          </a>
        </div>

        {/* Library feature highlights */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 opacity-0 animate-fadeIn"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300 hover:scale-105">
            <div className="text-indigo-400 mb-4">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Inventory Management
            </h3>
            <p className="text-indigo-200">
              Easily catalog and track your entire collection with powerful
              search and filtering.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300 hover:scale-105">
            <div className="text-indigo-400 mb-4">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 16V12M17 12V8M17 12H13M17 12H21M3 8H7C8.10457 8 9 8.89543 9 10V16C9 17.1046 8.10457 18 7 18H3V8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Checkout System
            </h3>
            <p className="text-indigo-200">
              Streamline borrowing with digital checkout, renewals, and
              automatic reminders.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-900/30 hover:border-indigo-700/30 transition-all duration-300 hover:scale-105">
            <div className="text-indigo-400 mb-4">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17V15M12 17V13M15 17V11M12 7L11.3 7.5C11.1 7.66667 10.8 7.66667 10.6 7.5L9.5 6.65C9.2 6.41667 8.75 6.5 8.6 6.85L8 8.5L7 9C6.66667 9.16667 6.66667 9.66667 7 9.83333L8.2 10.5C8.4 10.6667 8.5 10.8333 8.5 11C8.5 11.1667 8.4 11.3333 8.2 11.5L7 12C6.83333 12.0833 6.83333 12.25 7 12.3333L8 12.8333C8.16667 12.9167 8.33333 13.0833 8.33333 13.25C8.33333 13.4167 8.16667 13.5833 8 13.6667L7 14.3333C6.9 14.4 6.9 14.55 7 14.6L7.5 15C7.66667 15.1111 7.66667 15.3889 7.5 15.5L7 16C6.8 16.2 6.86667 16.4 7 16.5L8 17H9M12 7L12.7 7.5C12.9 7.66667 13.2 7.66667 13.4 7.5L14.5 6.65C14.8 6.41667 15.25 6.5 15.4 6.85L16 8.5L17 9C17.3333 9.16667 17.3333 9.66667 17 9.83333L15.8 10.5C15.6 10.6667 15.5 10.8333 15.5 11C15.5 11.1667 15.6 11.3333 15.8 11.5L17 12C17.1667 12.0833 17.1667 12.25 17 12.3333L16 12.8333C15.8333 12.9167 15.6667 13.0833 15.6667 13.25C15.6667 13.4167 15.8333 13.5833 16 13.6667L17 14.3333C17.1 14.4 17.1 14.55 17 14.6L16.5 15C16.3333 15.1111 16.3333 15.3889 16.5 15.5L17 16C17.2 16.2 17.1333 16.4 17 16.5L16 17H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Analytics & Reports
            </h3>
            <p className="text-indigo-200">
              Gain insights into usage patterns and optimize your collection
              with detailed reports.
            </p>
          </div>
        </div>

        
      </div>

      {/* Enhanced trust section and footer */}
      <div className="w-full">
        {/* Trust section with styled background */}
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-indigo-300 mb-8 text-lg text-center font-medium">
              Trusted by libraries worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-indigo-400">
              <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-medium group">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
                    fill="currentColor"
                  />
                  <path
                    d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
                    fill="currentColor"
                  />
                </svg>
                Public Libraries
              </div>
              <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-medium group">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5 9V3C21.5 2.59 21.34 2.19 21.06 1.88C20.78 1.57 20.4 1.38 20 1.35C19.79 1.33 19.58 1.35 19.38 1.41C19.18 1.47 19 1.56 18.85 1.69C18.59 1.91 18.26 2.05 17.9 2.1C17.55 2.15 17.19 2.1 16.87 1.95L16.83 1.93C16.37 1.72 15.85 1.66 15.35 1.76C14.85 1.87 14.39 2.13 14.04 2.5L12 4.84L9.96 2.5C9.61 2.13 9.15 1.87 8.65 1.76C8.15 1.66 7.63 1.72 7.17 1.93L7.13 1.95C6.81 2.1 6.45 2.15 6.1 2.1C5.74 2.05 5.41 1.91 5.15 1.69C5 1.56 4.82 1.47 4.62 1.41C4.42 1.35 4.21 1.33 4 1.35C3.6 1.38 3.22 1.57 2.94 1.88C2.66 2.19 2.5 2.59 2.5 3V17C2.5 17.41 2.66 17.81 2.94 18.12C3.22 18.43 3.6 18.62 4 18.65C4.21 18.67 4.42 18.65 4.62 18.59C4.82 18.53 5 18.44 5.15 18.31C5.41 18.09 5.74 17.95 6.1 17.9C6.45 17.85 6.81 17.9 7.13 18.05L7.17 18.07C7.63 18.28 8.15 18.34 8.65 18.24C9.15 18.13 9.61 17.87 9.96 17.5L12 15.16L14.04 17.5C14.39 17.87 14.85 18.13 15.35 18.24C15.85 18.34 16.37 18.28 16.83 18.07L16.87 18.05C17.19 17.9 17.55 17.85 17.9 17.9C18.26 17.95 18.59 18.09 18.85 18.31C19 18.44 19.18 18.53 19.38 18.59C19.58 18.65 19.79 18.67 20 18.65C20.4 18.62 20.78 18.43 21.06 18.12C21.34 17.81 21.5 17.41 21.5 17V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.5 21.5C22.3284 21.5 23 20.8284 23 20C23 19.1716 22.3284 18.5 21.5 18.5C20.6716 18.5 20 19.1716 20 20C20 20.8284 20.6716 21.5 21.5 21.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 20.5H2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                University Libraries
              </div>
              <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-medium group">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.0999 3H9.0999C7.0499 8.84 7.0499 15.16 9.0999 21H8.0999"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 3C16.95 8.84 16.95 15.16 15 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                School Libraries
              </div>
              <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-medium group">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 14H19C21 14 22 13 22 11V6C22 4 21 3 19 3H18C16 3 15 4 15 6V11C15 13 16 14 17.5 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 14H7.5C9 14 10 13 10 11V6C10 4 9 3 7.5 3H6C4 3 3 4 3 6V11C3 13 4 14 6 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.01 17V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.01 17V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.01 14V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 22H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Research Centers
              </div>
            </div>
          </div>
        </div>

        {/* Proper footer with links and copyright */}
        <footer className="bg-gray-950 bottom-0 text-indigo-100/70 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center mb-5">
                  <svg
                    className="w-8 h-8 text-indigo-400 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <image href={logo} x="0" y="0" height="24" width="24" />
                  </svg>
                  <span className="text-2xl font-bold text-white">
                    BookVault
                  </span>
                </div>
                <p className="text-sm">
                  Modern library management software to streamline operations
                  and delight your readers.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Updates
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Community
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-indigo-300 transition-colors"
                    >
                      Partners
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social links and copyright */}
            <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a
                  href="#"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-indigo-300/50">
                &copy; {new Date().getFullYear()} BookVault. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
