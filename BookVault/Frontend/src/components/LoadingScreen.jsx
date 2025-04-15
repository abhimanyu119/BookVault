// src/components/LoadingScreen.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Use this to ensure loading only happens once per session
const INITIAL_LOADING_KEY = "initialLoadingComplete";

const BookVaultLogo = () => (
  <motion.svg
    viewBox="0 0 165 155"
    width="165"
    height="155"
    initial="initial"
    animate="animate"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mask definition */}
    <defs>
      <mask id="revealMask">
        <motion.rect
          variants={{
            initial: { y: -155 }, // Start above
            animate: { y: 0 }, // Slide down
          }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
          width="165"
          height="155"
          fill="white"
        />
      </mask>
    </defs>

    {/* Base gray logo - always visible */}
    <g fill="#555555">
      <path d="m12.5 5.2c-0.3 0.7-0.4 29.4-0.3 63.8l0.3 62.5 63.2 0.3 63.3 0.2 0.5-2.2c0.3-1.3 0.4-30 0.3-63.8l-0.3-61.5-63.3-0.3c-50.1-0.2-63.4 0-63.7 1zm76.9 27.6c7.4 2.1 11.1 6.3 12.6 14.2 1.2 6.2 0 14.5-2.6 18.5-1.6 2.4-1.6 2.7 0.3 4.8 3.5 3.8 4.3 6.4 4.3 14.2 0 12.4-4.2 18.4-14.7 20.5-6.5 1.4-36 0.4-38-1.2-1.9-1.5-1.9-69.3 0-70.5 1-0.7 14.6-1.7 28.2-2 2.2-0.1 6.7 0.6 9.9 1.5z" />
      <path d="m74.4 47.7c-4.2 0.3-5.3 0.8-5.7 2.4-0.5 2-0.2 8.7 0.5 9.4 0.7 0.7 12.5 0.8 13.6 0.1 1.8-1.1 1.5-9.2-0.4-11-0.8-0.9-1.8-1.5-2.2-1.4-0.4 0.1-3 0.3-5.8 0.5z" />
      <path d="m68.9 77.2c-0.5 5-0.4 8.6 0.3 10.5 0.7 2.1 1.4 2.3 8.3 2.3 8.5 0 8.9-0.5 8.3-9.1l-0.3-4.4-8.2-0.3c-6.2-0.2-8.3 0-8.4 1z" />
      <path d="m149 12.9c-0.6 1.3-1 22.9-1 63.3 0 46.4-0.3 61.7-1.2 62.6-0.9 0.9-16.5 1.2-63.9 1.2-62.4 0-62.8 0-63.4 2-1.6 5.1-3.2 5 68.1 5 64.6 0 66.4-0.1 67.4-1.9 1.4-2.7 1.4-129.5 0-132.2-0.6-1-1.9-1.9-3-1.9-1.1 0-2.4 0.9-3 1.9z" />
    </g>

    {/* White logo layer - masked reveal */}
    <g mask="url(#revealMask)" fill="#ffffff">
      <path d="m12.5 5.2c-0.3 0.7-0.4 29.4-0.3 63.8l0.3 62.5 63.2 0.3 63.3 0.2 0.5-2.2c0.3-1.3 0.4-30 0.3-63.8l-0.3-61.5-63.3-0.3c-50.1-0.2-63.4 0-63.7 1zm76.9 27.6c7.4 2.1 11.1 6.3 12.6 14.2 1.2 6.2 0 14.5-2.6 18.5-1.6 2.4-1.6 2.7 0.3 4.8 3.5 3.8 4.3 6.4 4.3 14.2 0 12.4-4.2 18.4-14.7 20.5-6.5 1.4-36 0.4-38-1.2-1.9-1.5-1.9-69.3 0-70.5 1-0.7 14.6-1.7 28.2-2 2.2-0.1 6.7 0.6 9.9 1.5z" />
      <path d="m74.4 47.7c-4.2 0.3-5.3 0.8-5.7 2.4-0.5 2-0.2 8.7 0.5 9.4 0.7 0.7 12.5 0.8 13.6 0.1 1.8-1.1 1.5-9.2-0.4-11-0.8-0.9-1.8-1.5-2.2-1.4-0.4 0.1-3 0.3-5.8 0.5z" />
      <path d="m68.9 77.2c-0.5 5-0.4 8.6 0.3 10.5 0.7 2.1 1.4 2.3 8.3 2.3 8.5 0 8.9-0.5 8.3-9.1l-0.3-4.4-8.2-0.3c-6.2-0.2-8.3 0-8.4 1z" />
      <path d="m149 12.9c-0.6 1.3-1 22.9-1 63.3 0 46.4-0.3 61.7-1.2 62.6-0.9 0.9-16.5 1.2-63.9 1.2-62.4 0-62.8 0-63.4 2-1.6 5.1-3.2 5 68.1 5 64.6 0 66.4-0.1 67.4-1.9 1.4-2.7 1.4-129.5 0-132.2-0.6-1-1.9-1.9-3-1.9-1.1 0-2.4 0.9-3 1.9z" />
    </g>
  </motion.svg>
);

const LoadingScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(() => {
    // Check if we've already completed the loading animation this session
    return sessionStorage.getItem(INITIAL_LOADING_KEY) !== "true";
  });

  useEffect(() => {
    // If we've already loaded, complete immediately
    if (!loading) {
      if (onComplete) onComplete();
      return;
    }

    // Otherwise run the loading animation
    const timer = setTimeout(() => {
      // Mark initial loading as complete in session storage
      sessionStorage.setItem(INITIAL_LOADING_KEY, "true");
      setLoading(false);
      if (onComplete) onComplete();
    }, 2600); // Adjust timing to match animation

    return () => clearTimeout(timer);
  }, [loading, onComplete]);

  // If we've already loaded, don't render anything
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950 flex items-center justify-center z-50"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          className="w-48 h-48 flex items-center justify-center"
        >
          <BookVaultLogo />
        </motion.div>
      </div>
    </motion.div>
  );
};

LoadingScreen.propTypes = {
  onComplete: PropTypes.func,
};

export default LoadingScreen;
