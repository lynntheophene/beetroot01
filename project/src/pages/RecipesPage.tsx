import React, { useState, useEffect } from 'react';
import { usePantryStore } from '../store/pantryStore';
import { ChefHat, Youtube, Clock, ChefHatIcon, Loader2, Utensils } from 'lucide-react';
import { generateRecipes } from '../lib/gemini';
import { VoiceAssistant } from '../components/VoiceAssistant';

interface Recipe {
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
}

export function RecipesPage() {
  const { items } = usePantryStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    async function fetchRecipes() {
      if (items.length === 0) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const ingredients = items.map(item => item.name);
        const generatedRecipes = await generateRecipes(ingredients);
        setRecipes(generatedRecipes);
      } catch (err) {
        console.error('Failed to generate recipes:', err);
        setError('Failed to generate recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [items]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleNextStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <ChefHat className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Recipe Suggestions</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Generating recipes...</span>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 py-8">
          {error}
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Add some ingredients to your pantry to get recipe suggestions!
        </div>
      )}

      {selectedRecipe ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => {
              setSelectedRecipe(null);
              setCurrentStep(0);
            }}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to recipes
          </button>

          <h2 className="text-2xl font-semibold mb-4">{selectedRecipe.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Nutrition Info (per serving)</h3>
              <div className="space-y-1 text-sm">
                <p>Calories: {selectedRecipe.calories}</p>
                <p>Protein: {selectedRecipe.nutritionInfo.protein}</p>
                <p>Carbs: {selectedRecipe.nutritionInfo.carbs}</p>
                <p>Fat: {selectedRecipe.nutritionInfo.fat}</p>
                <p>Fiber: {selectedRecipe.nutritionInfo.fiber}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Cooking Info</h3>
              <div className="space-y-1 text-sm">
                <p>Prep Time: {selectedRecipe.prepTime}</p>
                <p>Cook Time: {selectedRecipe.cookTime}</p>
                <p>Servings: {selectedRecipe.servings}</p>
                <p className={getDifficultyColor(selectedRecipe.difficulty)}>
                  Difficulty: {selectedRecipe.difficulty}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Current Step ({currentStep + 1}/{selectedRecipe.instructions.length})</h3>
            <div className="bg-blue-50 p-4 rounded-lg text-lg">
              {selectedRecipe.instructions[currentStep]}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Previous Step
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep === selectedRecipe.instructions.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>

          {selectedRecipe.instructions.length > 0 && (
            <VoiceAssistant
              currentStep={currentStep}
              instructions={selectedRecipe.instructions}
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
            />
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Cook: {recipe.cookTime}</span>
                </div>
                <div className={`flex items-center ${getDifficultyColor(recipe.difficulty)}`}>
                  <ChefHatIcon className="h-4 w-4 mr-1" />
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Utensils className="h-4 w-4 mr-2" />
                  <span className="font-medium">Nutrition (per serving):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>Calories: {recipe.calories}</p>
                  <p>Protein: {recipe.nutritionInfo.protein}</p>
                  <p>Carbs: {recipe.nutritionInfo.carbs}</p>
                  <p>Fat: {recipe.nutritionInfo.fat}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className={`
                      ${items.some(item => item.name.toLowerCase().includes(ingredient.toLowerCase()))
                        ? 'text-green-600'
                        : 'text-gray-500'
                      }
                    `}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Cooking
                </button>

                <a
                  href={recipe.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Youtube className="h-5 w-5" />
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}