import { useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

const OutletWrapper = () => {
  const location = useLocation();

  return (
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
  );
};

export default OutletWrapper;
