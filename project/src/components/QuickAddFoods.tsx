import React from 'react';
import { Plus } from 'lucide-react';
import { FoodItem } from '../types';
import { useCalorieStore } from '../store/calorieStore';

interface QuickAddFoodsProps {
  foods: FoodItem[];
  selectedDate: Date;
}

export function QuickAddFoods({ foods, selectedDate }: QuickAddFoodsProps) {
  const { logMeal } = useCalorieStore();

  const handleQuickAdd = (food: FoodItem) => {
    const mealEntry = {
      foodId: food.id,
      foodName: food.name,
      quantity: food.nutritionInfo.servingSizeGrams,
      mealType: 'snack' as const,
      timestamp: selectedDate,
      nutritionInfo: food.nutritionInfo
    };

    logMeal(mealEntry);
  };

  if (foods.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => handleQuickAdd(food)}
            className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-colors group"
          >
            <div className="text-center">
              <div className="mb-2">
                <Plus className="h-6 w-6 mx-auto text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">{food.name}</p>
              <p className="text-xs text-gray-600">{food.nutritionInfo.calories} cal</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}