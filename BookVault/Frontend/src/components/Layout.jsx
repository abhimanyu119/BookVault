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

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

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

const INITIAL_LOADING_KEY = "initialLoadingComplete";

const Layout = () => {
  const location = useLocation();

  const [initialLoad, setInitialLoad] = useState(() => {
    return sessionStorage.getItem(INITIAL_LOADING_KEY) !== "true";
  });

  useEffect(() => {
    document.body.style.backgroundColor = "#0B0C2A";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    window.smoothScrollTo = smoothScrollTo;
  }, []);

  useEffect(() => {
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

  const handleInitialLoadComplete = () => {
    sessionStorage.setItem(INITIAL_LOADING_KEY, "true");
    setInitialLoad(false);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.4,
  };

  if (initialLoad) {
    return <LoadingScreen onComplete={handleInitialLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-blue-950">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
