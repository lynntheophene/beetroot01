import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  FoodItem, 
  MealEntry, 
  NutritionLog, 
  WeightEntry, 
  ExerciseEntry, 
  WaterEntry,
  Achievement,
  Challenge,
  AIFeatureRequest,
  NutritionInfo 
} from '../types';
import { startOfDay, subDays, isWithinInterval, format } from 'date-fns';

interface CalorieStore {
  // Food database
  foods: FoodItem[];
  customFoods: FoodItem[];
  
  // Daily logs
  nutritionLogs: NutritionLog[];
  currentDate: Date;
  
  // Tracking data
  weightEntries: WeightEntry[];
  exerciseEntries: ExerciseEntry[];
  waterEntries: WaterEntry[];
  
  // Gamification
  achievements: Achievement[];
  challenges: Challenge[];
  streaks: {
    currentCalorie: number;
    bestCalorie: number;
    currentWeight: number;
    bestWeight: number;
    currentWater: number;
    bestWater: number;
  };
  
  // AI Features
  aiFeatureRequests: AIFeatureRequest[];
  favoriteFeeds: string[];
  quickAddFoods: FoodItem[];
  
  // Actions for food management
  addFood: (food: Omit<FoodItem, 'id'>) => void;
  searchFoods: (query: string) => FoodItem[];
  getFoodById: (id: string) => FoodItem | undefined;
  
  // Actions for meal logging
  logMeal: (meal: Omit<MealEntry, 'id'>) => void;
  updateMealEntry: (id: string, updates: Partial<MealEntry>) => void;
  deleteMealEntry: (id: string) => void;
  getMealsForDate: (date: Date) => MealEntry[];
  getDailyNutrition: (date: Date) => NutritionInfo;
  calculateDayTotals: (meals: MealEntry[]) => {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
  };
  
  // Actions for tracking
  logWeight: (entry: Omit<WeightEntry, 'id'>) => void;
  logExercise: (entry: Omit<ExerciseEntry, 'id'>) => void;
  logWater: (amount: number) => void;
  getWeightProgress: () => WeightEntry[];
  getTodayWater: () => number;
  
  // Actions for goals and progress
  checkAchievements: () => void;
  updateStreaks: () => void;
  getCalorieProgress: (date: Date) => {
    consumed: number;
    goal: number;
    remaining: number;
    percentComplete: number;
  };
  
  // AI and features
  requestFeature: (description: string, category: AIFeatureRequest['category']) => void;
  processNaturalLanguageInput: (input: string) => Promise<void>;
  generateMealSuggestions: (mealType: string, targetCalories: number) => FoodItem[];
  analyzeEatingPatterns: () => {
    averageCalories: number;
    commonMealTimes: string[];
    frequentFoods: string[];
    nutritionTrends: any;
  };
  
  // Quick actions
  addToQuickAdd: (food: FoodItem) => void;
  removeFromQuickAdd: (foodId: string) => void;
  
  // Utilities
  exportData: () => string;
  importData: (data: string) => void;
  resetAllData: () => void;
}

const defaultFoods: FoodItem[] = [
  {
    id: 'apple-medium',
    name: 'Apple',
    category: 'Fruits',
    nutritionInfo: {
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      vitaminC: 8.4,
      servingSize: '1 medium apple',
      servingSizeGrams: 182
    },
    isCustom: false,
    verified: true
  },
  {
    id: 'banana-medium',
    name: 'Banana',
    category: 'Fruits',
    nutritionInfo: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
      vitaminC: 10.3,
      servingSize: '1 medium banana',
      servingSizeGrams: 118
    },
    isCustom: false,
    verified: true
  },
  {
    id: 'chicken-breast-100g',
    name: 'Chicken Breast (Skinless)',
    category: 'Protein',
    nutritionInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sodium: 74,
      cholesterol: 85,
      servingSize: '100g',
      servingSizeGrams: 100
    },
    isCustom: false,
    verified: true
  },
  {
    id: 'brown-rice-cooked-cup',
    name: 'Brown Rice (Cooked)',
    category: 'Grains',
    nutritionInfo: {
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      sodium: 10,
      servingSize: '1 cup',
      servingSizeGrams: 195
    },
    isCustom: false,
    verified: true
  }
];

export const useCalorieStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      foods: defaultFoods,
      customFoods: [],
      nutritionLogs: [],
      currentDate: new Date(),
      weightEntries: [],
      exerciseEntries: [],
      waterEntries: [],
      achievements: [],
      challenges: [],
      streaks: {
        currentCalorie: 0,
        bestCalorie: 0,
        currentWeight: 0,
        bestWeight: 0,
        currentWater: 0,
        bestWater: 0
      },
      aiFeatureRequests: [],
      favoriteFeeds: [],
      quickAddFoods: [],

      addFood: (food) => {
        const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newFood: FoodItem = { ...food, id, isCustom: true };
        set((state) => ({
          customFoods: [...state.customFoods, newFood],
          foods: [...state.foods, newFood]
        }));
      },

      searchFoods: (query) => {
        const allFoods = [...get().foods, ...get().customFoods];
        return allFoods.filter(food => 
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          food.category.toLowerCase().includes(query.toLowerCase()) ||
          food.brand?.toLowerCase().includes(query.toLowerCase())
        );
      },

      getFoodById: (id) => {
        const allFoods = [...get().foods, ...get().customFoods];
        return allFoods.find(food => food.id === id);
      },

      logMeal: (meal) => {
        const id = `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newMeal: MealEntry = { ...meal, id };
        
        set((state) => {
          const dateKey = format(meal.timestamp, 'yyyy-MM-dd');
          const existingLog = state.nutritionLogs.find(log => 
            format(log.date, 'yyyy-MM-dd') === dateKey
          );

          if (existingLog) {
            const updatedLogs = state.nutritionLogs.map(log => {
              if (format(log.date, 'yyyy-MM-dd') === dateKey) {
                const updatedMeals = [...log.meals, newMeal];
                const totals = get().calculateDayTotals(updatedMeals);
                return { ...log, meals: updatedMeals, ...totals };
              }
              return log;
            });
            return { nutritionLogs: updatedLogs };
          } else {
            const totals = get().calculateDayTotals([newMeal]);
            const newLog: NutritionLog = {
              id: `log-${Date.now()}`,
              date: startOfDay(meal.timestamp),
              meals: [newMeal],
              waterIntake: 0,
              ...totals
            };
            return { nutritionLogs: [...state.nutritionLogs, newLog] };
          }
        });

        get().updateStreaks();
        get().checkAchievements();
      },

      calculateDayTotals: (meals: MealEntry[]) => {
        return meals.reduce((totals, meal) => ({
          totalCalories: totals.totalCalories + meal.nutritionInfo.calories,
          totalProtein: totals.totalProtein + meal.nutritionInfo.protein,
          totalCarbs: totals.totalCarbs + meal.nutritionInfo.carbs,
          totalFat: totals.totalFat + meal.nutritionInfo.fat,
          totalFiber: totals.totalFiber + meal.nutritionInfo.fiber
        }), {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0
        });
      },

      updateMealEntry: (id, updates) => {
        set((state) => ({
          nutritionLogs: state.nutritionLogs.map(log => ({
            ...log,
            meals: log.meals.map(meal => 
              meal.id === id ? { ...meal, ...updates } : meal
            )
          }))
        }));
      },

      deleteMealEntry: (id) => {
        set((state) => ({
          nutritionLogs: state.nutritionLogs.map(log => ({
            ...log,
            meals: log.meals.filter(meal => meal.id !== id)
          }))
        }));
      },

      getMealsForDate: (date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const log = get().nutritionLogs.find(log => 
          format(log.date, 'yyyy-MM-dd') === dateKey
        );
        return log?.meals || [];
      },

      getDailyNutrition: (date) => {
        const meals = get().getMealsForDate(date);
        return meals.reduce((total, meal) => ({
          calories: total.calories + meal.nutritionInfo.calories,
          protein: total.protein + meal.nutritionInfo.protein,
          carbs: total.carbs + meal.nutritionInfo.carbs,
          fat: total.fat + meal.nutritionInfo.fat,
          fiber: total.fiber + meal.nutritionInfo.fiber,
          sugar: total.sugar + (meal.nutritionInfo.sugar || 0),
          sodium: total.sodium + (meal.nutritionInfo.sodium || 0),
          servingSize: 'Total',
          servingSizeGrams: 0
        }), {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          servingSize: 'Total',
          servingSizeGrams: 0
        });
      },

      logWeight: (entry) => {
        const id = `weight-${Date.now()}`;
        set((state) => ({
          weightEntries: [...state.weightEntries, { ...entry, id }].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }));
        get().updateStreaks();
        get().checkAchievements();
      },

      logExercise: (entry) => {
        const id = `exercise-${Date.now()}`;
        set((state) => ({
          exerciseEntries: [...state.exerciseEntries, { ...entry, id }]
        }));
        get().checkAchievements();
      },

      logWater: (amount) => {
        const entry: WaterEntry = {
          id: `water-${Date.now()}`,
          amount,
          timestamp: new Date()
        };
        set((state) => ({
          waterEntries: [...state.waterEntries, entry]
        }));
        get().updateStreaks();
        get().checkAchievements();
      },

      getWeightProgress: () => {
        return get().weightEntries.slice(0, 30); // Last 30 entries
      },

      getTodayWater: () => {
        const today = startOfDay(new Date());
        return get().waterEntries
          .filter(entry => startOfDay(entry.timestamp).getTime() === today.getTime())
          .reduce((total, entry) => total + entry.amount, 0);
      },

      getCalorieProgress: (date) => {
        const nutrition = get().getDailyNutrition(date);
        const goal = 2000; // This should come from user profile
        return {
          consumed: nutrition.calories,
          goal,
          remaining: Math.max(0, goal - nutrition.calories),
          percentComplete: Math.min(100, (nutrition.calories / goal) * 100)
        };
      },

      updateStreaks: () => {
        // Implementation for streak calculations
        // This would check daily goals completion and update streaks
      },

      checkAchievements: () => {
        // Implementation for checking if new achievements are unlocked
        // Based on various metrics like streaks, goals met, etc.
      },

      requestFeature: (description, category) => {
        const request: AIFeatureRequest = {
          id: `feature-${Date.now()}`,
          description,
          category,
          priority: 'medium',
          status: 'pending',
          requestedAt: new Date(),
          votes: 1
        };
        set((state) => ({
          aiFeatureRequests: [...state.aiFeatureRequests, request]
        }));
      },

      processNaturalLanguageInput: async (input) => {
        // Use Gemini AI to parse natural language input
        const { geminiAI } = await import('../lib/gemini');
        try {
          const result = await geminiAI.parseNaturalLanguageInput(input);
          
          // Process the actions
          for (const action of result.actions) {
            switch (action.type) {
              case 'log_water':
                get().logWater(action.data.amount);
                break;
              case 'log_weight':
                get().logWeight({
                  weight: action.data.weight,
                  date: new Date()
                });
                break;
              case 'request_feature':
                get().requestFeature(action.data.description, 'tracking');
                break;
              case 'log_food':
                // This would be handled by the foods array
                break;
            }
          }
          
          // Process the foods
          for (const food of result.foods) {
            const existingFood = get().searchFoods(food.name)[0];
            if (existingFood) {
              // Log the meal with the existing food
              const nutritionMultiplier = food.quantity / existingFood.nutritionInfo.servingSizeGrams;
              get().logMeal({
                foodId: existingFood.id,
                foodName: existingFood.name,
                quantity: food.quantity,
                mealType: food.mealType || 'snack',
                timestamp: new Date(),
                nutritionInfo: {
                  calories: Math.round(existingFood.nutritionInfo.calories * nutritionMultiplier),
                  protein: Math.round(existingFood.nutritionInfo.protein * nutritionMultiplier * 10) / 10,
                  carbs: Math.round(existingFood.nutritionInfo.carbs * nutritionMultiplier * 10) / 10,
                  fat: Math.round(existingFood.nutritionInfo.fat * nutritionMultiplier * 10) / 10,
                  fiber: Math.round(existingFood.nutritionInfo.fiber * nutritionMultiplier * 10) / 10,
                  servingSize: `${food.quantity}g`,
                  servingSizeGrams: food.quantity
                }
              });
            }
          }
          
          console.log('Processed natural language input:', result);
        } catch (error) {
          console.error('Failed to process natural language input:', error);
        }
      },

      generateMealSuggestions: (mealType, targetCalories) => {
        // AI-powered meal suggestions based on preferences and calorie targets
        return get().foods.filter(food => 
          food.nutritionInfo.calories <= targetCalories * 0.8
        ).slice(0, 5);
      },

      analyzeEatingPatterns: () => {
        const logs = get().nutritionLogs;
        const totalCalories = logs.reduce((sum, log) => sum + log.totalCalories, 0);
        const averageCalories = logs.length > 0 ? totalCalories / logs.length : 0;
        
        return {
          averageCalories,
          commonMealTimes: [], // Would analyze meal timing patterns
          frequentFoods: [], // Would find most logged foods
          nutritionTrends: {} // Would analyze nutrition trends over time
        };
      },

      addToQuickAdd: (food) => {
        set((state) => ({
          quickAddFoods: [...state.quickAddFoods.filter(f => f.id !== food.id), food].slice(0, 10)
        }));
      },

      removeFromQuickAdd: (foodId) => {
        set((state) => ({
          quickAddFoods: state.quickAddFoods.filter(f => f.id !== foodId)
        }));
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          nutritionLogs: state.nutritionLogs,
          weightEntries: state.weightEntries,
          exerciseEntries: state.exerciseEntries,
          waterEntries: state.waterEntries,
          customFoods: state.customFoods
        });
      },

      importData: (data) => {
        try {
          const imported = JSON.parse(data);
          set((state) => ({
            ...state,
            ...imported
          }));
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      resetAllData: () => {
        set({
          nutritionLogs: [],
          weightEntries: [],
          exerciseEntries: [],
          waterEntries: [],
          customFoods: [],
          achievements: [],
          aiFeatureRequests: [],
          quickAddFoods: []
        });
      }
    }),
    {
      name: 'calorie-tracker-storage',
      partialize: (state) => ({
        nutritionLogs: state.nutritionLogs,
        weightEntries: state.weightEntries,
        exerciseEntries: state.exerciseEntries,
        waterEntries: state.waterEntries,
        customFoods: state.customFoods,
        achievements: state.achievements,
        quickAddFoods: state.quickAddFoods,
        streaks: state.streaks
      })
    }
  )
);