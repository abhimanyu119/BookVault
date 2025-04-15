// src/components/Layout.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import LoadingScreen from "./LoadingScreen";

// Smooth scroll utility function
const smoothScrollTo = (elementId, offset = 80, duration = 800) => {
  const target = document.getElementById(elementId);
  if (!target) return;

  const targetPosition =
    target.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  // Easing function for a smoother animation
  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

// Scroll to top function
const scrollToTop = (duration = 500) => {
  const startPosition = window.pageYOffset;
  const distance = -startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

// Use this to ensure loading only happens once per session
const INITIAL_LOADING_KEY = "initialLoadingComplete";

// The ACTUAL Layout component
const Layout = () => {
  const location = useLocation();

  // Use sessionStorage to ensure loading only happens once per session
  const [initialLoad, setInitialLoad] = useState(() => {
    // Check if we've already loaded during this session
    return sessionStorage.getItem(INITIAL_LOADING_KEY) !== "true";
  });

  // Set background color on body to prevent white flashes
  useEffect(() => {
    document.body.style.backgroundColor = "#0B0C2A"; // Dark indigo background
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Make smoothScrollTo available globally
  useEffect(() => {
    window.smoothScrollTo = smoothScrollTo;
  }, []);

  // Handle scroll behavior on route change
  useEffect(() => {
    // Don't scroll during initial loading
    if (initialLoad) return;

    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        smoothScrollTo(id);
      }, 300);
    } else {
      scrollToTop();
    }
  }, [location.pathname, location.hash, initialLoad]);

  // Handle the completion of the initial loading animation
  const handleInitialLoadComplete = () => {
    // Mark that initial loading is done in session storage
    sessionStorage.setItem(INITIAL_LOADING_KEY, "true");
    setInitialLoad(false);
  };

  // Refined page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 8, // Subtle upward movement on exit, downward on enter
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -8,
    },
  };

  // Smooth transition with optimal timing
  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier curve for smooth motion
    duration: 0.4,
  };

  // If we're in the initial loading state, just show the loading screen
  if (initialLoad) {
    return <LoadingScreen onComplete={handleInitialLoadComplete} />;
  }

  // Normal page content with improved transitions
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
