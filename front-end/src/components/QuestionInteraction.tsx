import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface AnswerResponse {
  correct: boolean;
  updatedScore: number;
}

interface QuestionInteractionProps {
  currentUserId: string;
  onScoreUpdate: (newScore: number) => void;
}

const QuestionInteraction: React.FC<QuestionInteractionProps> = ({ currentUserId, onScoreUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);

  const fetchNewQuestion = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setMessage('');
    setIsShowingAnswer(false);
    try {
      const response = await axios.get<Question>(`${API_URL}/api/questions/random`);
      setCurrentQuestion(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('Failed to fetch question. Please try again.');
      setCurrentQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || isShowingAnswer) return;

    setSelectedAnswer(answer);
    setIsShowingAnswer(true);
    
    try {
      const response = await axios.post<AnswerResponse>(`${API_URL}/api/questions/check-answer`, {
        questionId: currentQuestion._id,
        answer,
        userId: currentUserId
      });

      if (response.data.correct) {
        setMessage('🎉 Correct! +100 points');
        setScore(response.data.updatedScore);
        setStreak(prev => prev + 1);
        onScoreUpdate(response.data.updatedScore);
      } else {
        setMessage('❌ Wrong answer!');
        setStreak(0);
      }

      // Always fetch new question after showing answer for 1.5 seconds
      setTimeout(fetchNewQuestion, 1500);
    } catch (error) {
      console.error('Failed to check answer:', error);
      setError('Failed to check answer. Please try again.');
      setSelectedAnswer(null);
      setIsShowingAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] p-6">
        <p className="text-red-500 dark:text-red-400 mb-4 text-center">{error}</p>
        <button
          onClick={fetchNewQuestion}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-[400px] p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">No questions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Score and Streak Display */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-purple-600 dark:text-purple-400 font-semibold">
          Score: {score}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500">🔥</span>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">
            Streak: {streak}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-[1.02]">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-200 mb-6">
          {currentQuestion.question}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={isShowingAnswer}
              className={`
                w-full p-4 text-left rounded-lg font-medium transition-all duration-300
                ${
                  selectedAnswer === option
                    ? message.includes('Correct')
                      ? 'bg-green-500 text-white transform scale-105'
                      : 'bg-red-500 text-white'
                    : isShowingAnswer
                    ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-purple-50 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 hover:shadow-md'
                }
                border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400
                transform transition-transform hover:scale-[1.02]
              `}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-200 mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`
          text-center font-bold text-lg p-4 rounded-lg transform transition-all duration-300
          ${message.includes('Correct') 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}
        `}>
          {message}
        </div>
      )}

      {/* Skip Question Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={fetchNewQuestion}
          disabled={loading || isShowingAnswer}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip Question →
        </button>
      </div>
    </div>
  );
};

export default QuestionInteraction; 