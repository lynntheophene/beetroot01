import React, { useState } from 'react';
import { Brain, Lightbulb, ThumbsUp, ThumbsDown, Star, Users, TrendingUp, Clock } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { AIFeatureRequest } from '../types';

export function AIFeatureHub() {
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AIFeatureRequest['category']>('tracking');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { aiFeatureRequests, requestFeature } = useCalorieStore();

  const categories = [
    { id: 'tracking', label: 'Food & Activity Tracking', icon: '📊' },
    { id: 'analysis', label: 'Analytics & Insights', icon: '📈' },
    { id: 'planning', label: 'Meal & Exercise Planning', icon: '📅' },
    { id: 'social', label: 'Social & Community', icon: '👥' },
    { id: 'ui', label: 'User Interface', icon: '🎨' },
    { id: 'integration', label: 'Integrations', icon: '🔗' }
  ];

  const handleSubmitFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureDescription.trim()) return;

    requestFeature(newFeatureDescription, selectedCategory);
    setNewFeatureDescription('');
  };

  const filteredRequests = aiFeatureRequests.filter(request => {
    const categoryMatch = filterCategory === 'all' || request.category === filterCategory;
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const exampleFeatures = [
    "Add barcode scanning for packaged foods",
    "Create a meal photo recognition feature",
    "Build a family meal planning system",
    "Add integration with fitness trackers",
    "Create a recipe recommendation engine",
    "Add voice commands for quick logging",
    "Build a social challenge system",
    "Create custom macro targets",
    "Add restaurant menu integration",
    "Build a grocery list generator"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-8 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Brain className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">AI Feature Hub</h1>
            <p className="text-purple-100">Think it, request it, and AI will build it!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              <span className="font-semibold">Smart Ideas</span>
            </div>
            <p className="text-sm text-purple-100">
              AI analyzes your requests and suggests implementation approaches
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Community Voting</span>
            </div>
            <p className="text-sm text-purple-100">
              Popular features get prioritized by community votes
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Rapid Development</span>
            </div>
            <p className="text-sm text-purple-100">
              AI-assisted development means faster feature delivery
            </p>
          </div>
        </div>
      </div>

      {/* Feature Request Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request a New Feature</h2>
        
        <form onSubmit={handleSubmitFeature} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AIFeatureRequest['category'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Description
            </label>
            <textarea
              value={newFeatureDescription}
              onChange={(e) => setNewFeatureDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the feature you'd like to see. Be as detailed as possible about what it should do and how it would help you..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
          >
            Submit Feature Request
          </button>
        </form>

        {/* Example Features */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Need inspiration? Try these:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => setNewFeatureDescription(feature)}
                className="text-left p-3 text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                💡 {feature}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Feature Requests</h2>
          <div className="flex space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Feature Request List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No feature requests yet</p>
            <p className="text-sm text-gray-500">Be the first to suggest a new feature!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">
                        {categories.find(c => c.id === request.category)?.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {categories.find(c => c.id === request.category)?.label}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.priority} priority
                      </span>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{request.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>{request.votes} votes</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Development Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Development Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {aiFeatureRequests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Pending Review</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {aiFeatureRequests.filter(r => r.status === 'in-progress').length}
            </div>
            <div className="text-sm text-blue-700 font-medium">In Development</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {aiFeatureRequests.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-sm text-green-700 font-medium">Completed</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {aiFeatureRequests.reduce((sum, r) => sum + r.votes, 0)}
            </div>
            <div className="text-sm text-purple-700 font-medium">Total Votes</div>
          </div>
        </div>
      </div>
    </div>
  );
}