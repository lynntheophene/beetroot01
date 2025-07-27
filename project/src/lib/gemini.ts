import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';

if (!API_KEY || API_KEY === 'demo-key') {
  console.warn('Gemini API key is not set. Using demo mode.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface FoodParsingResult {
  foods: Array<{
    name: string;
    quantity: number;
    unit: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    confidence: number;
  }>;
  actions: Array<{
    type: 'log_food' | 'log_water' | 'log_weight' | 'request_feature' | 'set_goal';
    data: any;
  }>;
  intent: string;
  confidence: number;
}

export class GeminiAI {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async parseNaturalLanguageInput(input: string): Promise<FoodParsingResult> {
    if (API_KEY === 'demo-key') {
      return this.fallbackParsing(input);
    }

    try {
      const prompt = `
        You are an AI assistant for a calorie tracking app called CalorieAI. Parse the following user input and extract:
        1. Food items with quantities and estimated serving sizes
        2. Actions the user wants to perform
        3. The overall intent

        User input: "${input}"

        Respond with a JSON object matching this structure:
        {
          "foods": [
            {
              "name": "food name",
              "quantity": number (in grams),
              "unit": "grams",
              "mealType": "breakfast|lunch|dinner|snack" (if mentioned),
              "confidence": 0.0-1.0
            }
          ],
          "actions": [
            {
              "type": "log_food|log_water|log_weight|request_feature|set_goal",
              "data": {}
            }
          ],
          "intent": "brief description of what user wants",
          "confidence": 0.0-1.0
        }

        Common food serving sizes:
        - 1 medium apple = 182g
        - 1 slice bread = 28g
        - 1 cup rice = 195g
        - 100g chicken breast = 100g
        - 1 banana = 118g
        - 1 cup milk = 245ml

        If user mentions water (250ml, 500ml, etc), create a log_water action.
        If user mentions weight (70kg, lost 2 pounds, etc), create a log_weight action.
        If user requests a new feature, create a request_feature action.
        If user wants to set goals, create a set_goal action.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.fallbackParsing(input);
      }
    } catch (error) {
      console.error('Gemini AI error:', error);
      return this.fallbackParsing(input);
    }
  }

  private fallbackParsing(input: string): FoodParsingResult {
    const foods = [];
    const actions = [];
    
    // Simple keyword matching as fallback
    if (input.toLowerCase().includes('apple')) {
      foods.push({
        name: 'Apple',
        quantity: 182,
        unit: 'grams',
        confidence: 0.8
      });
    }
    
    if (input.toLowerCase().includes('bread')) {
      const breadMatch = input.match(/(\d+)\s*slice/);
      foods.push({
        name: 'Bread',
        quantity: (breadMatch ? parseInt(breadMatch[1]) : 1) * 28,
        unit: 'grams',
        confidence: 0.8
      });
    }
    
    if (input.toLowerCase().includes('chicken')) {
      const chickenMatch = input.match(/(\d+)g?\s*chicken/);
      foods.push({
        name: 'Chicken Breast (Skinless)',
        quantity: chickenMatch ? parseInt(chickenMatch[1]) : 100,
        unit: 'grams',
        confidence: 0.8
      });
    }
    
    if (input.toLowerCase().includes('water')) {
      const waterMatch = input.match(/(\d+)\s*ml/);
      actions.push({
        type: 'log_water' as const,
        data: { amount: waterMatch ? parseInt(waterMatch[1]) : 250 }
      });
    }
    
    if (input.toLowerCase().includes('weight')) {
      const weightMatch = input.match(/(\d+(?:\.\d+)?)\s*kg/);
      if (weightMatch) {
        actions.push({
          type: 'log_weight' as const,
          data: { weight: parseFloat(weightMatch[1]) }
        });
      }
    }
    
    if (input.toLowerCase().includes('feature') || input.toLowerCase().includes('add')) {
      actions.push({
        type: 'request_feature' as const,
        data: { description: input }
      });
    }

    return {
      foods,
      actions,
      intent: input.includes('feature') ? 'Request new feature' : 'Log food items',
      confidence: 0.6
    };
  }
}

export const geminiAI = new GeminiAI();

// Enhanced list of items with storage conditions
const itemStorageInfo = {
  vegetables: {
    defaultDays: 7,
    conditions: 'Store in the crisper drawer of your refrigerator',
    items: [
      'tomato', 'potato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce',
      'cucumber', 'pepper', 'cabbage', 'celery', 'garlic', 'mushroom', 'zucchini',
      'eggplant', 'cauliflower', 'asparagus', 'corn', 'green bean', 'pea'
    ]
  },
  fruits: {
    defaultDays: 5,
    conditions: 'Store at room temperature until ripe, then refrigerate',
    items: [
      'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry',
      'blackberry', 'pear', 'peach', 'plum', 'mango', 'pineapple', 'kiwi'
    ]
  },
  dairy: {
    defaultDays: 14,
    conditions: 'Store in refrigerator at 40°F (4°C) or below',
    items: [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese'
    ]
  },
  meat: {
    defaultDays: 3,
    conditions: 'Store in refrigerator at 40°F (4°C) or below, or freeze',
    items: [
      'beef', 'chicken', 'pork', 'lamb', 'turkey', 'fish', 'shrimp'
    ]
  }
};

function getItemCategory(name: string): keyof typeof itemStorageInfo | null {
  const lowercaseName = name.toLowerCase();
  for (const [category, info] of Object.entries(itemStorageInfo)) {
    if (info.items.some(item => lowercaseName.includes(item))) {
      return category as keyof typeof itemStorageInfo;
    }
  }
  return null;
}

function getStorageInfo(name: string) {
  const category = getItemCategory(name);
  if (!category) return null;
  return {
    category,
    ...itemStorageInfo[category]
  };
}

function calculateExpirationDate(itemName: string): { date: Date | undefined; storageInfo: string | null } {
  const info = getStorageInfo(itemName);
  if (!info) return { date: undefined, storageInfo: null };

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + info.defaultDays);

  return {
    date: expirationDate,
    storageInfo: info.conditions
  };
}

export async function analyzeReceipt(imageData: string): Promise<Array<{
  name: string;
  quantity: number;
  price: number;
  isVegetable: boolean;
  expirationDate?: Date;
  storageInfo?: string;
}>> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Please analyze this receipt image and extract product details. 
    Return ONLY a valid JSON array of objects with this exact format:
    [
      {
        "name": "Product Name",
        "quantity": 1,
        "price": 0.00
      }
    ]
    Include only pantry items, groceries, and household goods. Ensure prices are in decimal format.
    Do not include any other text or explanation.`;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(',')[1]
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Response is not an array');
      }

      const validItems = parsedData
        .filter(item => 
          item && 
          typeof item === 'object' && 
          typeof item.name === 'string' && 
          typeof item.quantity === 'number' &&
          typeof item.price === 'number' &&
          item.name.trim() !== '' &&
          item.quantity > 0 &&
          item.price >= 0
        )
        .map(item => {
          const { date, storageInfo } = calculateExpirationDate(item.name);
          const category = getItemCategory(item.name);
          return {
            ...item,
            isVegetable: category === 'vegetables',
            expirationDate: date,
            storageInfo
          };
        });

      return validItems;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      throw new Error('Failed to parse the receipt data');
    }
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}

export async function generateRecipes(ingredients: string[]): Promise<Array<{
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  cookTime: string;
  calories: number;
  servings: number;
  nutritionInfo: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
}>> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Given these ingredients: ${ingredients.join(', ')}, suggest 3 possible recipes.
    Return ONLY a valid JSON array of recipe objects with this exact format:
    [
      {
        "title": "Recipe Name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "videoUrl": "https://www.youtube.com/watch?v=XXXXX",
        "difficulty": "easy|medium|hard",
        "prepTime": "X mins",
        "cookTime": "X mins",
        "calories": 000,
        "servings": 0,
        "nutritionInfo": {
          "protein": "Xg",
          "carbs": "Xg",
          "fat": "Xg",
          "fiber": "Xg"
        }
      }
    ]
    For each recipe:
    - Include only realistic, common recipes
    - Use only common household ingredients
    - Keep instructions clear and concise
    - For videoUrl, use real YouTube cooking videos that match the recipe
    - Ensure all ingredients are common and easily available
    - Include accurate calorie and nutrition information per serving
    Do not include any other text or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      const recipes = JSON.parse(cleanedText);

      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }

      return recipes;
    } catch (e) {
      console.error('Failed to parse recipe response:', e);
      throw new Error('Failed to generate recipes');
    }
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}

export async function generateDietPlan(profile: any): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    
    const prompt = `Generate a personalized diet plan based on the following profile:
    - BMI: ${bmi.toFixed(1)}
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Activity Level: ${profile.activityLevel}
    - Dietary Restrictions: ${profile.dietaryRestrictions.join(', ')}
    - Goals: ${profile.goals}

    Return ONLY a valid JSON object with this exact format:
    {
      "dailyCalories": number,
      "macroSplit": {
        "protein": number (in grams),
        "carbs": number (in grams),
        "fat": number (in grams)
      },
      "recommendations": [
        {
          "category": "string (meal type)",
          "foods": ["food1", "food2"],
          "reason": "string (explanation)"
        }
      ]
    }

    Ensure the plan is realistic and healthy. Include specific foods and portions.
    Do not include any other text or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse diet plan response:', e);
      throw new Error('Failed to generate diet plan');
    }
  } catch (error) {
    console.error('Error generating diet plan:', error);
    throw error;
  }
}

// Enhanced list of items with storage conditions
const itemStorageInfo = {
  vegetables: {
    defaultDays: 7,
    conditions: 'Store in the crisper drawer of your refrigerator',
    items: [
      'tomato', 'potato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce',
      'cucumber', 'pepper', 'cabbage', 'celery', 'garlic', 'mushroom', 'zucchini',
      'eggplant', 'cauliflower', 'asparagus', 'corn', 'green bean', 'pea'
    ]
  },
  fruits: {
    defaultDays: 5,
    conditions: 'Store at room temperature until ripe, then refrigerate',
    items: [
      'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry',
      'blackberry', 'pear', 'peach', 'plum', 'mango', 'pineapple', 'kiwi'
    ]
  },
  dairy: {
    defaultDays: 14,
    conditions: 'Store in refrigerator at 40°F (4°C) or below',
    items: [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese'
    ]
  },
  meat: {
    defaultDays: 3,
    conditions: 'Store in refrigerator at 40°F (4°C) or below, or freeze',
    items: [
      'beef', 'chicken', 'pork', 'lamb', 'turkey', 'fish', 'shrimp'
    ]
  }
};

function getItemCategory(name: string): keyof typeof itemStorageInfo | null {
  const lowercaseName = name.toLowerCase();
  for (const [category, info] of Object.entries(itemStorageInfo)) {
    if (info.items.some(item => lowercaseName.includes(item))) {
      return category as keyof typeof itemStorageInfo;
    }
  }
  return null;
}

function getStorageInfo(name: string) {
  const category = getItemCategory(name);
  if (!category) return null;
  return {
    category,
    ...itemStorageInfo[category]
  };
}

function calculateExpirationDate(itemName: string): { date: Date | undefined; storageInfo: string | null } {
  const info = getStorageInfo(itemName);
  if (!info) return { date: undefined, storageInfo: null };

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + info.defaultDays);

  return {
    date: expirationDate,
    storageInfo: info.conditions
  };
}

export async function analyzeReceipt(imageData: string): Promise<Array<{
  name: string;
  quantity: number;
  price: number;
  isVegetable: boolean;
  expirationDate?: Date;
  storageInfo?: string;
}>> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Please analyze this receipt image and extract product details. 
    Return ONLY a valid JSON array of objects with this exact format:
    [
      {
        "name": "Product Name",
        "quantity": 1,
        "price": 0.00
      }
    ]
    Include only pantry items, groceries, and household goods. Ensure prices are in decimal format.
    Do not include any other text or explanation.`;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(',')[1]
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      
      if (!Array.isArray(parsedData)) {
        throw new Error('Response is not an array');
      }

      const validItems = parsedData
        .filter(item => 
          item && 
          typeof item === 'object' && 
          typeof item.name === 'string' && 
          typeof item.quantity === 'number' &&
          typeof item.price === 'number' &&
          item.name.trim() !== '' &&
          item.quantity > 0 &&
          item.price >= 0
        )
        .map(item => {
          const { date, storageInfo } = calculateExpirationDate(item.name);
          const category = getItemCategory(item.name);
          return {
            ...item,
            isVegetable: category === 'vegetables',
            expirationDate: date,
            storageInfo
          };
        });

      return validItems;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      throw new Error('Failed to parse the receipt data');
    }
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}

export async function generateRecipes(ingredients: string[]): Promise<Array<{
  title: string;
  ingredients: string[];
  instructions: string[];
  videoUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  cookTime: string;
  calories: number;
  servings: number;
  nutritionInfo: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
}>> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Given these ingredients: ${ingredients.join(', ')}, suggest 3 possible recipes.
    Return ONLY a valid JSON array of recipe objects with this exact format:
    [
      {
        "title": "Recipe Name",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "videoUrl": "https://www.youtube.com/watch?v=XXXXX",
        "difficulty": "easy|medium|hard",
        "prepTime": "X mins",
        "cookTime": "X mins",
        "calories": 000,
        "servings": 0,
        "nutritionInfo": {
          "protein": "Xg",
          "carbs": "Xg",
          "fat": "Xg",
          "fiber": "Xg"
        }
      }
    ]
    For each recipe:
    - Include only realistic, common recipes
    - Use only common household ingredients
    - Keep instructions clear and concise
    - For videoUrl, use real YouTube cooking videos that match the recipe
    - Ensure all ingredients are common and easily available
    - Include accurate calorie and nutrition information per serving
    Do not include any other text or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      const recipes = JSON.parse(cleanedText);

      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }

      return recipes;
    } catch (e) {
      console.error('Failed to parse recipe response:', e);
      throw new Error('Failed to generate recipes');
    }
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}

export async function generateDietPlan(profile: UserProfile): Promise<DietPlan> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    
    const prompt = `Generate a personalized diet plan based on the following profile:
    - BMI: ${bmi.toFixed(1)}
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Activity Level: ${profile.activityLevel}
    - Dietary Restrictions: ${profile.dietaryRestrictions.join(', ')}
    - Goals: ${profile.goals}

    Return ONLY a valid JSON object with this exact format:
    {
      "dailyCalories": number,
      "macroSplit": {
        "protein": number (in grams),
        "carbs": number (in grams),
        "fat": number (in grams)
      },
      "recommendations": [
        {
          "category": "string (meal type)",
          "foods": ["food1", "food2"],
          "reason": "string (explanation)"
        }
      ]
    }

    Ensure the plan is realistic and healthy. Include specific foods and portions.
    Do not include any other text or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text.trim().replace(/```json|\```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse diet plan response:', e);
      throw new Error('Failed to generate diet plan');
    }
  } catch (error) {
    console.error('Error generating diet plan:', error);
    throw error;
  }
}