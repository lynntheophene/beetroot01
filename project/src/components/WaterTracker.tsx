import React from 'react';
import { Droplets, Plus } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';

interface WaterTrackerProps {
  currentIntake: number;
  goal: number;
}

export function WaterTracker({ currentIntake, goal }: WaterTrackerProps) {
  const { logWater } = useCalorieStore();

  const progress = (currentIntake / goal) * 100;
  const remaining = Math.max(0, goal - currentIntake);
  
  const quickAmounts = [250, 500, 750]; // ml

  const handleAddWater = (amount: number) => {
    logWater(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Water Intake</h3>
        <Droplets className="h-5 w-5 text-blue-600" />
      </div>

      {/* Progress Visualization */}
      <div className="mb-6">
        <div className="relative w-20 h-32 mx-auto">
          {/* Water Glass SVG */}
          <svg viewBox="0 0 80 120" className="w-full h-full">
            {/* Glass outline */}
            <path
              d="M15 20 L15 100 Q15 110 25 110 L55 110 Q65 110 65 100 L65 20 Z"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Water fill */}
            <path
              d={`M17 ${118 - (progress * 0.98)} L17 108 Q17 108 27 108 L53 108 Q63 108 63 108 L63 ${118 - (progress * 0.98)} Z`}
              fill="#3b82f6"
              opacity="0.7"
            />
            {/* Glass highlight */}
            <path
              d="M20 25 L20 35"
              stroke="white"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-lg font-bold text-gray-900">
            {(currentIntake / 1000).toFixed(1)}L
          </p>
          <p className="text-sm text-gray-600">
            of {(goal / 1000).toFixed(1)}L goal
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0L</span>
          <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
          <span>{(goal / 1000).toFixed(1)}L</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick Add</p>
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAddWater(amount)}
              className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
            >
              <Plus className="h-3 w-3" />
              <span>{amount}ml</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="mt-4">
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Custom amount"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const amount = parseInt((e.target as HTMLInputElement).value);
                if (amount > 0) {
                  handleAddWater(amount);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              const amount = parseInt(input.value);
              if (amount > 0) {
                handleAddWater(amount);
                input.value = '';
              }
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {remaining > 0 ? (
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium text-blue-600">
              {(remaining / 1000).toFixed(1)}L
            </span>{' '}
            remaining to reach your goal
          </p>
        ) : (
          <p className="text-sm text-green-600 text-center font-medium">
            🎉 Daily water goal achieved!
          </p>
        )}
      </div>
    </div>
  );
}