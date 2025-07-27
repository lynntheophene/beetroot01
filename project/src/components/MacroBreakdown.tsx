import React from 'react';
import { PieChart } from 'lucide-react';
import { NutritionInfo } from '../types';

interface MacroBreakdownProps {
  nutrition: NutritionInfo;
}

export function MacroBreakdown({ nutrition }: MacroBreakdownProps) {
  const totalCalories = nutrition.calories;
  
  // Calculate calories from macros
  const proteinCalories = nutrition.protein * 4;
  const carbCalories = nutrition.carbs * 4;
  const fatCalories = nutrition.fat * 9;
  
  // Calculate percentages
  const proteinPercent = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbPercent = totalCalories > 0 ? (carbCalories / totalCalories) * 100 : 0;
  const fatPercent = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

  const macros = [
    {
      name: 'Protein',
      amount: nutrition.protein,
      calories: proteinCalories,
      percent: proteinPercent,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      name: 'Carbs',
      amount: nutrition.carbs,
      calories: carbCalories,
      percent: carbPercent,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      name: 'Fat',
      amount: nutrition.fat,
      calories: fatCalories,
      percent: fatPercent,
      color: 'bg-red-500',
      lightColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Macro Breakdown</h3>
        <PieChart className="h-5 w-5 text-blue-600" />
      </div>

      {/* Visual Breakdown */}
      <div className="mb-6">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          {macros.map((macro, index) => (
            <div
              key={macro.name}
              className={macro.color}
              style={{ width: `${macro.percent}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Protein</span>
          <span>Carbs</span>
          <span>Fat</span>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-3">
        {macros.map((macro) => (
          <div key={macro.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${macro.color}`} />
              <span className="font-medium text-gray-900">{macro.name}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{macro.amount.toFixed(1)}g</p>
              <p className="text-xs text-gray-500">
                {macro.calories.toFixed(0)} cal ({macro.percent.toFixed(0)}%)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Nutrients */}
      {(nutrition.fiber > 0 || nutrition.sugar || nutrition.sodium) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Other Nutrients</h4>
          <div className="space-y-2">
            {nutrition.fiber > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fiber</span>
                <span className="font-medium text-gray-900">{nutrition.fiber.toFixed(1)}g</span>
              </div>
            )}
            {nutrition.sugar !== undefined && nutrition.sugar > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sugar</span>
                <span className="font-medium text-gray-900">{nutrition.sugar.toFixed(1)}g</span>
              </div>
            )}
            {nutrition.sodium !== undefined && nutrition.sodium > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sodium</span>
                <span className="font-medium text-gray-900">{nutrition.sodium.toFixed(0)}mg</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Macro Goals (placeholder - would come from user profile) */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Daily Goals</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          {macros.map((macro) => {
            // Placeholder goals - these would come from user profile
            const goals = { Protein: 150, Carbs: 200, Fat: 65 };
            const goal = goals[macro.name as keyof typeof goals];
            const progress = (macro.amount / goal) * 100;
            
            return (
              <div key={macro.name} className={`p-3 rounded-lg ${macro.lightColor}`}>
                <p className={`text-xs font-medium ${macro.textColor}`}>{macro.name}</p>
                <p className="text-lg font-bold text-gray-900">
                  {macro.amount.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">of {goal}g</p>
                <div className="mt-2 w-full bg-white rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${macro.color}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}