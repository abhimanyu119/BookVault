import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full z-50 sticky top-2 flex justify-center items-center ">
      <nav className=" w-11/12 max-w-6xl bg-gray-900/80 backdrop-blur-sm rounded-lg py-2 px-6 flex justify-between items-center z-50">
        {/* Logo */}
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-white mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <circle cx="12" cy="12" r="5" fill="#111827" />
          </svg>
          <span className="text-2xl font-bold">BookVault</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <button className="flex items-center text-gray-200 hover:text-white">
              Products
              <svg
                className="w-4 h-4 ml-1"
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
            {/* Dropdown could be added here */}
          </div>

          <div className="relative group">
            <button className="flex items-center text-gray-200 hover:text-white">
              Company
              <svg
                className="w-4 h-4 ml-1"
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
            {/* Dropdown could be added here */}
          </div>

          <a href="#" className="text-gray-200 hover:text-white">
            Pricing
          </a>
          <a href="#" className="text-gray-200 hover:text-white">
            For Accountants
          </a>
        </div>

        {/* Authentication */}
        <div className="hidden md:flex items-center space-x-3">
          <a href="/login" className="text-gray-200 hover:text-white px-3 py-2">
            Log in
          </a>
          <a
            href="/signup"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 font-medium"
          >
            Get started
          </a>
        </div>

        {/* Mobile Menu Button */}
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
          <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 rounded-lg shadow-lg py-4 md:hidden">
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

              <a href="#" className="text-gray-200 hover:text-white py-2">
                Pricing
              </a>
              <a href="#" className="text-gray-200 hover:text-white py-2">
                For Accountants
              </a>
              <a href="#" className="text-gray-200 hover:text-white py-2">
                Log in
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 font-medium text-center"
              >
                Get started
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
