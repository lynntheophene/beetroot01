import React, { useState } from 'react';
import { Plus, Search, Calendar, Target, TrendingUp, Award, Zap } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { FoodLogger } from '../components/FoodLogger';
import { CalorieProgress } from '../components/CalorieProgress';
import { MacroBreakdown } from '../components/MacroBreakdown';
import { QuickAddFoods } from '../components/QuickAddFoods';
import { WaterTracker } from '../components/WaterTracker';
import { StreakDisplay } from '../components/StreakDisplay';
import { AINaturalLanguageInput } from '../components/AINaturalLanguageInput';
import { format } from 'date-fns';

export function CalorieTrackingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'goals' | 'ai'>('log');
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  
  const {
    getMealsForDate,
    getDailyNutrition,
    getCalorieProgress,
    getTodayWater,
    streaks,
    quickAddFoods
  } = useCalorieStore();

  const todayMeals = getMealsForDate(selectedDate);
  const dailyNutrition = getDailyNutrition(selectedDate);
  const calorieProgress = getCalorieProgress(selectedDate);
  const todayWater = getTodayWater();

  const mealsByType = {
    breakfast: todayMeals.filter(m => m.mealType === 'breakfast'),
    lunch: todayMeals.filter(m => m.mealType === 'lunch'),
    dinner: todayMeals.filter(m => m.mealType === 'dinner'),
    snack: todayMeals.filter(m => m.mealType === 'snack')
  };

  const tabs = [
    { id: 'log', label: 'Food Log', icon: Plus },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai', label: 'AI Assistant', icon: Zap }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calorie Tracker</h1>
            <p className="text-gray-600">Track your daily nutrition and reach your goals</p>
          </div>
          <div className="flex items-center space-x-4">
            <StreakDisplay streaks={streaks} />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyNutrition.calories.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">of {calorieProgress.goal}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, calorieProgress.percentComplete)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyNutrition.protein.toFixed(1)}g
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyNutrition.carbs.toFixed(1)}g
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fat</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyNutrition.fat.toFixed(1)}g
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'log' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Food Log */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Add */}
            {quickAddFoods.length > 0 && (
              <QuickAddFoods foods={quickAddFoods} selectedDate={selectedDate} />
            )}

            {/* AI Natural Language Input */}
            <AINaturalLanguageInput />

            {/* Meal Sections */}
            {Object.entries(mealsByType).map(([mealType, meals]) => (
              <div key={mealType} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {mealType}
                  </h3>
                  <button
                    onClick={() => setShowFoodLogger(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Food</span>
                  </button>
                </div>

                {meals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No {mealType} logged yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{meal.foodName}</p>
                          <p className="text-sm text-gray-600">
                            {meal.quantity}g • {meal.nutritionInfo.calories} cal
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            P: {meal.nutritionInfo.protein.toFixed(1)}g
                          </p>
                          <p className="text-sm text-gray-600">
                            C: {meal.nutritionInfo.carbs.toFixed(1)}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CalorieProgress progress={calorieProgress} />
            <MacroBreakdown nutrition={dailyNutrition} />
            <WaterTracker currentIntake={todayWater} goal={2000} />
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Dashboard</h2>
          <p className="text-gray-600">Detailed progress tracking coming soon...</p>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals & Targets</h2>
          <p className="text-gray-600">Goal setting and management coming soon...</p>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Assistant</h2>
          <p className="text-gray-600">Advanced AI features coming soon...</p>
        </div>
      )}

      {/* Food Logger Modal */}
      {showFoodLogger && (
        <FoodLogger
          onClose={() => setShowFoodLogger(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}