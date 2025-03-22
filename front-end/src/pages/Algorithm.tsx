import React, { useState } from 'react';

// Implementation 1: Using loop
const sum_to_n_a = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Implementation 2: Using formula n*(n+1)/2
const sum_to_n_b = (n: number): number => {
  return (n * (n + 1)) / 2;
};

// Implementation 3: Using recursion
const sum_to_n_c = (n: number): number => {
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
};

const AlgorithmPage: React.FC = () => {
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<{ method: string; value: number | null }[]>([]);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    const n = parseInt(number);
    if (isNaN(n) || n < 0) {
      setError('Please enter a valid positive number');
      return;
    }
    if (n > Number.MAX_SAFE_INTEGER) {
      setError('Number is too large to calculate');
      return;
    }
    
    setError('');
    const results = [
      { method: 'Loop Method', value: sum_to_n_a(n) },
      { method: 'Formula Method', value: sum_to_n_b(n) },
      { method: 'Recursive Method', value: sum_to_n_c(n) }
    ];
    setResult(results);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
           Problem 1: Three ways to sum to n
          </h1>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-end justify-center">
              <div className="flex-1">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter a number (n)
                </label>
                <input
                  type="number"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  placeholder="Enter a positive integer"
                />
              </div>
              <button
                onClick={handleCalculate}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                Calculate
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}
          </div>

          {result.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Results:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.map((res, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{res.method}</h3>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{res.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">How it works:</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• <strong>Loop Method:</strong> Iterates from 1 to n and adds each number</li>
              <li>• <strong>Formula Method:</strong> Uses the mathematical formula n*(n+1)/2</li>
              <li>• <strong>Recursive Method:</strong> Recursively adds n to sum of (n-1)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmPage;
