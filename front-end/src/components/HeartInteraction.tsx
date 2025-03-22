import { motion } from "framer-motion";
import React from "react";

interface HeartInteractionProps {
  onHeartClick: () => void;
}

const HeartInteraction: React.FC<HeartInteractionProps> = ({
  onHeartClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-pink-200 dark:border-pink-900 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center mb-6 w-full">
    
      </div>
      <motion.button
        onClick={onHeartClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="transform transition-all focus:outline-none"
      >
        <div className="relative">
          <motion.svg
            className="w-32 h-32 text-pink-500 filter drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
            animate={{
              scale: [1, 1.1, 1],
              transition: { duration: 2, repeat: Infinity },
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
          <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 hover:opacity-20 rounded-full transition-opacity" />
        </div>
      </motion.button>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-center font-medium">
        Click the heart to show me your love!
        <br />
        <span className="text-sm text-pink-500">
          Try entering the special phrase for a surprise!
        </span>
      </p>

    </div>
  );
};

export default HeartInteraction; 