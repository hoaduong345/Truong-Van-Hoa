import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "../hooks/useProfile";
import CreateProfileForm from "../components/CreateProfileForm";
import Leaderboard from "../components/Leaderboard";
import UserTabs from "../components/UserTabs";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Person {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar: string;
  score: number;
}

const Crud: React.FC = () => {
  const { profile, saveProfile, clearProfile } = useProfile();
  const [step, setStep] = useState<1 | 2>(() => profile?.step || 1);
  const [currentUserId, setCurrentUserId] = useState<string>(
    () => profile?.id || ""
  );

  // Data states
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    sortBy: "score",
    sortOrder: "desc",
  });

  // Fetch all people
  const fetchPeople = async () => {
    if (step === 1) return; // Don't fetch on step 1
    setFetchLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        ...(filters.gender && { gender: filters.gender }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await axios.get<Person[]>(
        `${API_URL}/api/people?${params}`
      );
      setPeople(response.data);
    } catch (err) {
      console.error("Failed to fetch people:", err);
      setError("Failed to fetch people. Please try again later.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [filters, step]);

  // Handle heart click
  const handleHeartClick = async () => {
    try {
      const response = await axios.post<Person>(
        `${API_URL}/api/people/${currentUserId}/increase-score`,
        { message }
      );
      setPeople(
        people.map((person) =>
          person._id === currentUserId ? response.data : person
        )
      );
      setMessage("");
    } catch (err) {
      setError("Failed to update score");
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (
      !currentUserId ||
      !window.confirm("Are you sure you want to delete your account?")
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/people/${currentUserId}`);
      clearProfile();
      setStep(1);
      fetchPeople();
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  const handleProfileCreated = (userId: string) => {
    setCurrentUserId(userId);
    saveProfile(userId, 2);
    setStep(2);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Handle score update from question
  const handleScoreUpdate = (newScore: number) => {
    setPeople(
      people.map((person) =>
        person._id === currentUserId ? { ...person, score: newScore } : person
      )
    );
  };

  // Layout 1: Input Form
  if (step === 1) {
    return <CreateProfileForm onProfileCreated={handleProfileCreated} />;
  }

  // Layout 2: Display and Interaction
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Interactions */}
          <div className="flex flex-col space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
              <UserTabs
                currentUserId={currentUserId}
                message={message}
                onMessageChange={setMessage}
                onHeartClick={handleHeartClick}
                onDeleteAccount={handleDeleteAccount}
                onScoreUpdate={handleScoreUpdate}
              />
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
            <div className="p-6">
        
              <Leaderboard
                people={people}
                currentUserId={currentUserId}
                loading={fetchLoading}
                error={error}
                filters={filters}
                onFilterChange={handleFilterChange}
                onRetry={fetchPeople}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crud;
