import React, { useState } from 'react';
import { X, Search, Plus, Scan, Camera } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { FoodItem, MealEntry } from '../types';

interface FoodLoggerProps {
  onClose: () => void;
  selectedDate: Date;
  defaultMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export function FoodLogger({ onClose, selectedDate, defaultMealType = 'breakfast' }: FoodLoggerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState(defaultMealType);
  const [showCreateFood, setShowCreateFood] = useState(false);

  const { searchFoods, logMeal, addFood } = useCalorieStore();

  const searchResults = searchQuery ? searchFoods(searchQuery) : [];

  const handleLogFood = () => {
    if (!selectedFood) return;

    const nutritionMultiplier = quantity / selectedFood.nutritionInfo.servingSizeGrams;
    
    const mealEntry: Omit<MealEntry, 'id'> = {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      quantity,
      mealType,
      timestamp: selectedDate,
      nutritionInfo: {
        calories: Math.round(selectedFood.nutritionInfo.calories * nutritionMultiplier),
        protein: Math.round(selectedFood.nutritionInfo.protein * nutritionMultiplier * 10) / 10,
        carbs: Math.round(selectedFood.nutritionInfo.carbs * nutritionMultiplier * 10) / 10,
        fat: Math.round(selectedFood.nutritionInfo.fat * nutritionMultiplier * 10) / 10,
        fiber: Math.round(selectedFood.nutritionInfo.fiber * nutritionMultiplier * 10) / 10,
        sugar: selectedFood.nutritionInfo.sugar ? Math.round(selectedFood.nutritionInfo.sugar * nutritionMultiplier * 10) / 10 : 0,
        sodium: selectedFood.nutritionInfo.sodium ? Math.round(selectedFood.nutritionInfo.sodium * nutritionMultiplier * 10) / 10 : 0,
        servingSize: `${quantity}g`,
        servingSizeGrams: quantity
      }
    };

    logMeal(mealEntry);
    onClose();
  };

  const handleCreateCustomFood = (foodData: Omit<FoodItem, 'id' | 'isCustom' | 'verified'>) => {
    addFood({
      ...foodData,
      verified: false
    });
    setShowCreateFood(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Log Food</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type as any)}
                  className={`py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors ${
                    mealType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <Scan className="h-4 w-4" />
              <span>Scan Barcode</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </button>
            <button
              onClick={() => setShowCreateFood(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Food</span>
            </button>
          </div>

          {/* Food Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Food
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for food..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedFood?.id === food.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{food.name}</p>
                      <p className="text-sm text-gray-600">
                        {food.brand && `${food.brand} • `}
                        {food.nutritionInfo.calories} cal per {food.nutritionInfo.servingSize}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>P: {food.nutritionInfo.protein}g</p>
                      <p>C: {food.nutritionInfo.carbs}g</p>
                      <p>F: {food.nutritionInfo.fat}g</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Food Details */}
          {selectedFood && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Selected Food</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">{selectedFood.name}</p>
                  <p className="text-sm text-gray-600">{selectedFood.category}</p>
                  {selectedFood.brand && (
                    <p className="text-sm text-gray-600">{selectedFood.brand}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(selectedFood.nutritionInfo.calories * (quantity / selectedFood.nutritionInfo.servingSizeGrams))}
                  </p>
                  <p className="text-sm text-gray-600">calories</p>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (grams)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nutrition Preview */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="font-medium">Protein</p>
                  <p className="text-gray-600">
                    {Math.round(selectedFood.nutritionInfo.protein * (quantity / selectedFood.nutritionInfo.servingSizeGrams) * 10) / 10}g
                  </p>
                </div>
                <div>
                  <p className="font-medium">Carbs</p>
                  <p className="text-gray-600">
                    {Math.round(selectedFood.nutritionInfo.carbs * (quantity / selectedFood.nutritionInfo.servingSizeGrams) * 10) / 10}g
                  </p>
                </div>
                <div>
                  <p className="font-medium">Fat</p>
                  <p className="text-gray-600">
                    {Math.round(selectedFood.nutritionInfo.fat * (quantity / selectedFood.nutritionInfo.servingSizeGrams) * 10) / 10}g
                  </p>
                </div>
                <div>
                  <p className="font-medium">Fiber</p>
                  <p className="text-gray-600">
                    {Math.round(selectedFood.nutritionInfo.fiber * (quantity / selectedFood.nutritionInfo.servingSizeGrams) * 10) / 10}g
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogFood}
            disabled={!selectedFood}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Log Food
          </button>
        </div>
      </div>

      {/* Create Custom Food Modal */}
      {showCreateFood && (
        <CustomFoodCreator
          onClose={() => setShowCreateFood(false)}
          onSave={handleCreateCustomFood}
        />
      )}
    </div>
  );
}

// Custom Food Creator Component
interface CustomFoodCreatorProps {
  onClose: () => void;
  onSave: (food: Omit<FoodItem, 'id' | 'isCustom' | 'verified'>) => void;
}

function CustomFoodCreator({ onClose, onSave }: CustomFoodCreatorProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Custom',
    servingSize: '',
    servingSizeGrams: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const food: Omit<FoodItem, 'id' | 'isCustom' | 'verified'> = {
      name: formData.name,
      brand: formData.brand || undefined,
      category: formData.category,
      nutritionInfo: {
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        fiber: formData.fiber,
        sugar: formData.sugar,
        sodium: formData.sodium,
        servingSize: formData.servingSize || `${formData.servingSizeGrams}g`,
        servingSizeGrams: formData.servingSizeGrams
      }
    };

    onSave(food);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Create Custom Food</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
              <input
                type="text"
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                placeholder="e.g., 1 cup, 1 piece"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.servingSizeGrams}
                onChange={(e) => setFormData({ ...formData, servingSizeGrams: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories *</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}