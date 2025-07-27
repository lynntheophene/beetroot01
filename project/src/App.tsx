import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  ShoppingBasket, 
  BookOpen, 
  LineChart, 
  Target, 
  Brain, 
  Calendar, 
  Scale, 
  Lightbulb,
  Menu 
} from 'lucide-react';
import { PantryPage } from './pages/PantryPage';
import { RecipesPage } from './pages/RecipesPage';
import { NutritionPage } from './pages/NutritionPage';
import { CalorieTrackingPage } from './pages/CalorieTrackingPage';
import { MealPlanningPage } from './pages/MealPlanningPage';
import { WeightTrackingPage } from './pages/WeightTrackingPage';
import { AIFeatureHub } from './pages/AIFeatureHub';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigationItems = [
    { path: '/', label: 'Calorie Tracker', icon: Target, primary: true },
    { path: '/weight', label: 'Weight Tracking', icon: Scale },
    { path: '/meal-planning', label: 'Meal Planning', icon: Calendar },
    { path: '/pantry', label: 'Pantry', icon: ShoppingBasket },
    { path: '/recipes', label: 'Recipes', icon: BookOpen },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/ai-features', label: 'AI Features', icon: Lightbulb, special: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">CalorieAI</span>
                <span className="block text-xs text-gray-500">Think. Track. Transform.</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      item.primary
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : item.special
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.special && (
                      <span className="px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                        item.primary
                          ? 'bg-blue-600 text-white'
                          : item.special
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.special && (
                        <span className="px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                          NEW
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Feature Highlight Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Brain className="h-4 w-4" />
            <span>🎉 NEW: AI-Powered Feature Requests - Think of a feature and we'll build it!</span>
            <Link to="/ai-features" className="underline hover:no-underline font-medium">
              Try it now →
            </Link>
          </div>
        </div>
      </div>

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  ShoppingBasket, 
  BookOpen, 
  LineChart, 
  Target, 
  Brain, 
  Calendar, 
  Scale, 
  Lightbulb,
  Menu 
} from 'lucide-react';
import { PantryPage } from './pages/PantryPage';
import { RecipesPage } from './pages/RecipesPage';
import { NutritionPage } from './pages/NutritionPage';
import { CalorieTrackingPage } from './pages/CalorieTrackingPage';
import { MealPlanningPage } from './pages/MealPlanningPage';
import { WeightTrackingPage } from './pages/WeightTrackingPage';
import { AIFeatureHub } from './pages/AIFeatureHub';
import { AdvancedAnalyticsPage } from './pages/AdvancedAnalyticsPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigationItems = [
    { path: '/', label: 'Calorie Tracker', icon: Target, primary: true },
    { path: '/weight', label: 'Weight Tracking', icon: Scale },
    { path: '/meal-planning', label: 'Meal Planning', icon: Calendar },
    { path: '/pantry', label: 'Pantry', icon: ShoppingBasket },
    { path: '/recipes', label: 'Recipes', icon: BookOpen },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/ai-features', label: 'AI Features', icon: Lightbulb, special: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">CalorieAI</span>
                <span className="block text-xs text-gray-500">Think. Track. Transform.</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      item.primary
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : item.special
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.special && (
                      <span className="px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                        item.primary
                          ? 'bg-blue-600 text-white'
                          : item.special
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.special && (
                        <span className="px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                          NEW
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Feature Highlight Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Brain className="h-4 w-4" />
            <span>🎉 NEW: AI-Powered Feature Requests - Think of a feature and we'll build it!</span>
            <Link to="/ai-features" className="underline hover:no-underline font-medium">
              Try it now →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<CalorieTrackingPage />} />
        <Route path="/weight" element={<WeightTrackingPage />} />
        <Route path="/meal-planning" element={<MealPlanningPage />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
        <Route path="/ai-features" element={<AIFeatureHub />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">CalorieAI</span>
              </div>
              <p className="text-sm text-gray-600">
                The smartest calorie tracking app powered by AI. Track, plan, and transform your health journey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Smart Food Logging</li>
                <li>AI Meal Planning</li>
                <li>Weight Tracking</li>
                <li>Progress Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">AI Powered</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Natural Language Input</li>
                <li>Photo Recognition</li>
                <li>Smart Suggestions</li>
                <li>Feature Requests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Share Progress</li>
                <li>Join Challenges</li>
                <li>Vote on Features</li>
                <li>Help Others</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 CalorieAI. Built with ❤️ and artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">CalorieAI</span>
              </div>
              <p className="text-sm text-gray-600">
                The smartest calorie tracking app powered by AI. Track, plan, and transform your health journey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Smart Food Logging</li>
                <li>AI Meal Planning</li>
                <li>Weight Tracking</li>
                <li>Progress Analytics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">AI Powered</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Natural Language Input</li>
                <li>Photo Recognition</li>
                <li>Smart Suggestions</li>
                <li>Feature Requests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Share Progress</li>
                <li>Join Challenges</li>
                <li>Vote on Features</li>
                <li>Help Others</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 CalorieAI. Built with ❤️ and artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;