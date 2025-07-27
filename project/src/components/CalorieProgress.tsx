import React from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

interface CalorieProgressProps {
  progress: {
    consumed: number;
    goal: number;
    remaining: number;
    percentComplete: number;
  };
}

export function CalorieProgress({ progress }: CalorieProgressProps) {
  const { consumed, goal, remaining, percentComplete } = progress;
  
  const isOverGoal = consumed > goal;
  const excessCalories = isOverGoal ? consumed - goal : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Calorie Progress</h3>
        <Target className="h-5 w-5 text-blue-600" />
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={isOverGoal ? "#ef4444" : "#3b82f6"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${Math.min(percentComplete, 100) * 3.14} 314`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{consumed}</p>
              <p className="text-xs text-gray-500">of {goal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {isOverGoal ? (
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Over goal by {excessCalories} calories</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{remaining} calories remaining</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isOverGoal ? 'bg-red-500' : 'bg-blue-600'
          }`}
          style={{ width: `${Math.min(percentComplete, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span className="font-medium">{percentComplete.toFixed(0)}%</span>
        <span>{goal}</span>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{percentComplete.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(0, remaining)}
            </p>
            <p className="text-xs text-gray-500">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}