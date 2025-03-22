import React, { useState } from "react";
import HeartInteraction from "./HeartInteraction";
import QuestionInteraction from "./QuestionInteraction";
import UserSettings from "./UserSettings";

interface UserTabsProps {
  currentUserId: string;
  message: string;
  onMessageChange: (message: string) => void;
  onHeartClick: () => void;
  onDeleteAccount: () => void;
  onScoreUpdate: (newScore: number) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({
  currentUserId,
  onHeartClick,
  onDeleteAccount,
  onScoreUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"heart" | "question" | "settings">(
    "heart"
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs Header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("question")}
            className={`${
              activeTab === "question"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }
            whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-1 text-center focus:outline-none transition-all duration-200`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab("heart")}
            className={`${
              activeTab === "heart"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }
            whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-1 text-center focus:outline-none transition-all duration-200`}
          >
            Heart
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`${
              activeTab === "settings"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }
            whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex-1 text-center focus:outline-none transition-all duration-200`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content with Animation */}
      <div className="p-6">
        <div
          className={`transition-opacity duration-200 ${
            activeTab === "heart" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <HeartInteraction
            onHeartClick={onHeartClick}
          />
        </div>
        <div
          className={`transition-opacity duration-200 ${
            activeTab === "question" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <QuestionInteraction
            currentUserId={currentUserId}
            onScoreUpdate={onScoreUpdate}
          />
        </div>
        <div
          className={`transition-opacity duration-200 ${
            activeTab === "settings" ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <UserSettings
            currentUserId={currentUserId}
            onDeleteAccount={onDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default UserTabs;
