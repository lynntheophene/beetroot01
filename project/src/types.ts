export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  expirationDate?: Date;
  addedAt: Date;
  isVegetable: boolean;
  storageInfo?: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface PantryStore {
  items: PantryItem[];
  addItem: (item: Omit<PantryItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dietaryRestrictions: string[];
  goals: 'maintain' | 'lose' | 'gain';
}

export interface NutritionLog {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DietPlan {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: {
    category: string;
    foods: string[];
    reason: string;
  }[];
}