import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Person {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  score: number;
}

interface LeaderboardProps {
  people: Person[];
  currentUserId: string;
  loading: boolean;
  error: string;
  filters: {
    gender: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onRetry: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  people,
  currentUserId,
  loading,
  error,
  filters,
  onFilterChange,
  onRetry,
}) => {
  // Sort people by score in descending order
  const sortedPeople = [...people].sort((a, b) => b.score - a.score);
  
  // Get top 10 players
  const top10 = sortedPeople.slice(0, 10);
  
  // Find current user's position
  const currentUserIndex = sortedPeople.findIndex(p => p._id === currentUserId);
  const currentUser = sortedPeople[currentUserIndex];
  
  // Determine if we need to show current user separately
  const showCurrentUserSeparately = currentUserIndex >= 10;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Leaderboard 💖
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
          />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/20"
        >
          {error}
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg text-center"
            >
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {people.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Users
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg text-center"
            >
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {people.reduce((sum, p) => sum + p.score, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Score
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg text-center"
            >
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {Math.round(
                  people.reduce((sum, p) => sum + p.age, 0) / people.length || 0
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg Age</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange("gender", e.target.value)}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="score">Sort by Score</option>
              <option value="age">Sort by Age</option>
              <option value="name">Sort by Name</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) => onFilterChange("sortOrder", e.target.value)}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* People List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {people.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 dark:text-gray-400 py-8"
                >
                  No users found
                </motion.div>
              ) : (
                <>
                  {/* Top 10 Players */}
                  {top10.map((person, index) => (
                    <motion.div
                      key={person._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 ${
                        person._id === currentUserId
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20"
                          : "bg-white dark:bg-gray-700"
                      } rounded-lg shadow-sm transition-all hover:shadow-md`}
                    >
                      <div className="relative">
                        <img
                          src={
                            person.avatar.startsWith("/uploads")
                              ? `${API_URL}${person.avatar}`
                              : person.avatar
                          }
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 dark:border-pink-800"
                        />
                        <div className={`absolute -top-2 -right-2 ${
                          index < 3 ? 'bg-gradient-to-r from-yellow-400 to-pink-500' : 'bg-pink-500'
                        } text-white text-xs rounded-full w-6 h-6 flex items-center justify-center`}>
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                          {person.name}
                          {person._id === currentUserId && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full dark:bg-pink-900 dark:text-pink-100"
                            >
                              You
                            </motion.span>
                          )}
                          {index < 3 && (
                            <span className="ml-2">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                        </h3>
                        <div className="text-gray-500 dark:text-gray-300 text-sm">
                          <span>Age: {person.age}</span>
                          <span className="mx-2">•</span>
                          <motion.span
                            key={person.score}
                            initial={{ scale: 1.2, color: "#EC4899" }}
                            animate={{ scale: 1, color: "#6B7280" }}
                          >
                            Score: {person.score.toLocaleString()}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Current User (if not in top 10) */}
                  {showCurrentUserSeparately && currentUser && (
                    <>
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                            Your Position
                          </span>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="relative">
                          <img
                            src={
                              currentUser.avatar.startsWith("/uploads")
                                ? `${API_URL}${currentUser.avatar}`
                                : currentUser.avatar
                            }
                            alt={currentUser.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 dark:border-pink-800"
                          />
                          <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            #{currentUserIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                            {currentUser.name}
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full dark:bg-pink-900 dark:text-pink-100"
                            >
                              You
                            </motion.span>
                          </h3>
                          <div className="text-gray-500 dark:text-gray-300 text-sm">
                            <span>Age: {currentUser.age}</span>
                            <span className="mx-2">•</span>
                            <motion.span
                              key={currentUser.score}
                              initial={{ scale: 1.2, color: "#EC4899" }}
                              animate={{ scale: 1, color: "#6B7280" }}
                            >
                              Score: {currentUser.score.toLocaleString()}
                            </motion.span>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 text-xs text-purple-600 dark:text-purple-400"
                            >
                              Keep going! You need {top10[9].score - currentUser.score + 1} more points to reach Top 10! 🎯
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard; 