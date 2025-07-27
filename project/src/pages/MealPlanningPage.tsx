import React, { useState } from 'react';
import { Calendar, ChefHat, Users, Clock, DollarSign, Heart, Zap } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { Recipe, FoodItem } from '../types';

export function MealPlanningPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [planningGoals, setPlanningGoals] = useState({
    caloriesPerDay: 2000,
    budget: 100,
    mealPrepTime: 30,
    dietaryPreferences: [] as string[]
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateMealSuggestions, foods } = useCalorieStore();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI meal planning generation
    setTimeout(() => {
      const plan = generateWeeklyMealPlan();
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 2000);
  };

  const generateWeeklyMealPlan = () => {
    const plan: any = {};
    
    daysOfWeek.forEach(day => {
      plan[day] = {};
      mealTypes.forEach(mealType => {
        const targetCalories = {
          breakfast: planningGoals.caloriesPerDay * 0.25,
          lunch: planningGoals.caloriesPerDay * 0.35,
          dinner: planningGoals.caloriesPerDay * 0.35,
          snack: planningGoals.caloriesPerDay * 0.05
        }[mealType] || 200;
        
        plan[day][mealType] = generateMealSuggestions(mealType, targetCalories);
      });
    });
    
    return plan;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Meal Planning</h1>
            <p className="text-gray-600">Let AI create personalized meal plans for your goals</p>
          </div>
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isGenerating ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Planning Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Daily Calories</h3>
          </div>
          <input
            type="number"
            value={planningGoals.caloriesPerDay}
            onChange={(e) => setPlanningGoals({
              ...planningGoals,
              caloriesPerDay: Number(e.target.value)
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Weekly Budget</h3>
          </div>
          <input
            type="number"
            value={planningGoals.budget}
            onChange={(e) => setPlanningGoals({
              ...planningGoals,
              budget: Number(e.target.value)
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Prep Time (min)</h3>
          </div>
          <input
            type="number"
            value={planningGoals.mealPrepTime}
            onChange={(e) => setPlanningGoals({
              ...planningGoals,
              mealPrepTime: Number(e.target.value)
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Dietary Pref.</h3>
          </div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>No restrictions</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
            <option>Mediterranean</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900">Generating Your Meal Plan</h3>
            <p className="text-gray-600">AI is analyzing your preferences and nutritional needs...</p>
          </div>
        </div>
      )}

      {/* Generated Meal Plan */}
      {generatedPlan && !isGenerating && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Weekly Meal Plan</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-center">{day}</h3>
                
                <div className="space-y-3">
                  {mealTypes.map((mealType) => (
                    <div key={mealType} className="border-b border-gray-100 pb-2">
                      <h4 className="text-sm font-medium text-gray-700 capitalize mb-1">
                        {mealType}
                      </h4>
                      {generatedPlan[day][mealType]?.slice(0, 1).map((food: FoodItem, index: number) => (
                        <div key={index} className="text-xs text-gray-600">
                          <p className="font-medium">{food.name}</p>
                          <p>{food.nutritionInfo.calories} cal</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-blue-600">
                    ~{planningGoals.caloriesPerDay} cal
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan Actions */}
          <div className="mt-6 flex justify-center space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Save Plan
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate Shopping List
            </button>
            <button
              onClick={handleGeneratePlan}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Suggestions</h3>
          </div>
          <p className="text-sm text-gray-600">
            AI analyzes your goals, preferences, and past meals to suggest optimal food combinations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Budget Optimization</h3>
          </div>
          <p className="text-sm text-gray-600">
            Automatically balances nutrition goals with budget constraints for cost-effective meal planning.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Family Planning</h3>
          </div>
          <p className="text-sm text-gray-600">
            Scale recipes and plan meals for multiple family members with different dietary needs.
          </p>
        </div>
      </div>
    </div>
  );
}