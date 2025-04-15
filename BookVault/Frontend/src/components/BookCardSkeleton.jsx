// src/components/BookCardSkeleton.jsx
import { motion } from "framer-motion";

const BookCardSkeleton = () => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-indigo-900/30 overflow-hidden h-full">
      {/* Book cover skeleton */}
      <motion.div
        className="w-full h-48 bg-gray-800"
        animate={{
          background: ["#1f2937", "#111827", "#1f2937"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="p-4">
        {/* Title skeleton */}
        <motion.div
          className="h-5 w-3/4 bg-gray-800 rounded mb-2"
          animate={{
            background: ["#1f2937", "#111827", "#1f2937"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />

        {/* Author skeleton */}
        <motion.div
          className="h-4 w-1/2 bg-gray-800 rounded mb-3"
          animate={{
            background: ["#1f2937", "#111827", "#1f2937"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />

        {/* Description skeleton lines */}
        <motion.div
          className="h-3 w-full bg-gray-800 rounded mb-2"
          animate={{
            background: ["#1f2937", "#111827", "#1f2937"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />

        <motion.div
          className="h-3 w-5/6 bg-gray-800 rounded mb-2"
          animate={{
            background: ["#1f2937", "#111827", "#1f2937"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />

        <motion.div
          className="h-3 w-4/6 bg-gray-800 rounded"
          animate={{
            background: ["#1f2937", "#111827", "#1f2937"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
