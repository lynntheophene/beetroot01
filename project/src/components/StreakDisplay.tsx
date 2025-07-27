import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';

interface StreakDisplayProps {
  streaks: {
    currentCalorie: number;
    bestCalorie: number;
    currentWeight: number;
    bestWeight: number;
    currentWater: number;
    bestWater: number;
  };
}

export function StreakDisplay({ streaks }: StreakDisplayProps) {
  const streakData = [
    {
      type: 'Calorie Goal',
      current: streaks.currentCalorie,
      best: streaks.bestCalorie,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      type: 'Water Goal',
      current: streaks.currentWater,
      best: streaks.bestWater,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      type: 'Weight Tracking',
      current: streaks.currentWeight,
      best: streaks.bestWeight,
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="flex space-x-4">
      {streakData.map((streak, index) => {
        const Icon = streak.icon;
        return (
          <div
            key={index}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${streak.bgColor}`}
          >
            <Icon className={`h-4 w-4 ${streak.color}`} />
            <div className="text-center">
              <p className={`text-sm font-bold ${streak.color}`}>
                {streak.current}
              </p>
              <p className="text-xs text-gray-600">day streak</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}