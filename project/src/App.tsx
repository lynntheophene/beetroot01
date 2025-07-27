import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ShoppingBasket, BookOpen, LineChart } from 'lucide-react';
import { PantryPage } from './pages/PantryPage';
import { RecipesPage } from './pages/RecipesPage';
import { NutritionPage } from './pages/NutritionPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <ShoppingBasket className="h-6 w-6" />
                <span className="font-semibold">Pantry</span>
              </Link>
              <Link to="/recipes" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <BookOpen className="h-6 w-6" />
                <span className="font-semibold">Recipes</span>
              </Link>
              <Link to="/nutrition" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <LineChart className="h-6 w-6" />
                <span className="font-semibold">Nutrition</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
      </Routes>
    </div>
  );
}

export default App;