export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  servingSize: string;
  servingSizeGrams: number;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  expirationDate?: Date;
  addedAt: Date;
  isVegetable: boolean;
  storageInfo?: string;
  nutritionInfo?: NutritionInfo;
}

export interface PantryStore {
  items: PantryItem[];
  addItem: (item: Omit<PantryItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dietaryRestrictions: string[];
  goals: 'maintain' | 'lose' | 'gain';
  targetWeight?: number;
  dailyCalorieGoal?: number;
  waterGoal?: number; // in ml
  preferredUnits: 'metric' | 'imperial';
  timezone: string;
  notifications: {
    mealReminders: boolean;
    waterReminders: boolean;
    weightTracking: boolean;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  category: string;
  nutritionInfo: NutritionInfo;
  isCustom: boolean;
  createdBy?: string;
  verified: boolean;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number; // in grams
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
  nutritionInfo: NutritionInfo;
  notes?: string;
}

export interface NutritionLog {
  id: string;
  date: Date;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  waterIntake: number; // in ml
  exerciseCaloriesBurned?: number;
  notes?: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
  notes?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  duration: number; // in minutes
  caloriesBurned: number;
  date: Date;
  notes?: string;
}

export interface WaterEntry {
  id: string;
  amount: number; // in ml
  timestamp: Date;
}

export interface DietPlan {
  id: string;
  name: string;
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlan: {
    [key: string]: { // day of week
      breakfast: FoodItem[];
      lunch: FoodItem[];
      dinner: FoodItem[];
      snacks: FoodItem[];
    };
  };
  recommendations: {
    category: string;
    foods: string[];
    reason: string;
  }[];
  duration: number; // in days
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  target: number;
  category: 'calorie' | 'weight' | 'exercise' | 'consistency' | 'social';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  reward: string;
  participants?: string[];
}

export interface AIFeatureRequest {
  id: string;
  description: string;
  category: 'tracking' | 'analysis' | 'planning' | 'social' | 'ui' | 'integration';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  requestedAt: Date;
  implementedAt?: Date;
  votes: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: {
    foodId: string;
    foodName: string;
    quantity: number;
    unit: string;
  }[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number;
  servings: number;
  nutritionPerServing: NutritionInfo;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy?: string;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
}