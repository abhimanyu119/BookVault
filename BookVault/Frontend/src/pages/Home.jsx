// import React from "react";

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10"></div>

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      {/* <div className="absolute bottom-1/4 -right-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div> */}

      {/* Main content */}
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Small badge */}
        <div className="inline-block mb-4 px-4 py-2 bg-gray-800/80 rounded-full backdrop-blur-sm border border-gray-700 text-sm text-gray-300">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
          Now available for everyone
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Make Every <span className="text-blue-400">Moment</span> Count
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Simplify your workflow, maximize your productivity, and achieve more
          with less effort.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200 transform hover:scale-105">
            Get Started
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 shadow-lg transition-all duration-200 transform hover:scale-105">
            Browse
          </button>
        </div>

        {/* Social proof */}
        <div className="pt-16">
          <p className="text-gray-400 mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {["Company 1", "Company 2", "Company 3", "Company 4"].map(
              (company, index) => (
                <div key={index} className="h-8 text-gray-500 font-bold">
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-900 -z-10">
        <svg
          className="absolute bottom-0 w-full h-24"
          viewBox="0 0 1440 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 144L60 132C120 120 240 96 360 84C480 72 600 72 720 96C840 120 960 168 1080 174C1200 180 1320 144 1380 126L1440 108V240H1380C1320 240 1200 240 1080 240C960 240 840 240 720 240C600 240 480 240 360 240C240 240 120 240 60 240H0V144Z"
            fill="#111827"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 192L60 180C120 168 240 144 360 138C480 132 600 144 720 156C840 168 960 180 1080 174C1200 168 1320 144 1380 132L1440 120V240H1380C1320 240 1200 240 1080 240C960 240 840 240 720 240C600 240 480 240 360 240C240 240 120 240 60 240H0V192Z"
            fill="#111827"
          />
        </svg>
      </div>
    </div>
  );
};

export default Home;
