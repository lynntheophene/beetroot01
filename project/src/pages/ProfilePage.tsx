import React, { useState } from 'react';
import { usePantryStore } from '../store/pantryStore';
import { Award, Share2, Trophy, Star, Settings, CreditCard, Bell, User, Link } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

export function ProfilePage() {
  const { userPoints, badges } = usePantryStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'payments'>('overview');
  const [upiSettings, setUpiSettings] = useState({
    upiId: '',
    name: '',
    bankName: '',
  });

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle UPI settings update
    console.log('UPI settings updated:', upiSettings);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1200)' }}
        />
        
        <div className="p-6">
          {/* Profile Navigation */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-2 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <User className="inline-block h-5 w-5 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-4 px-2 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Settings className="inline-block h-5 w-5 mr-2" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`pb-4 px-2 ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <CreditCard className="inline-block h-5 w-5 mr-2" />
                Payments
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                    {userPoints}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Your Profile</h1>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                      <span>Level {Math.floor(userPoints / 100) + 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={badge.image}
                          alt={badge.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Earned {new Date(badge.unlockedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <FacebookShareButton
                          url={window.location.href}
                          quote={`I earned the ${badge.name} badge! 🌟`}
                        >
                          <button className="text-blue-600 hover:text-blue-700">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={window.location.href}
                          title={`I earned the ${badge.name} badge! 🌟`}
                        >
                          <button className="text-blue-400 hover:text-blue-500">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </TwitterShareButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>Push notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span>SMS notifications</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Profile URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">UPI Settings</h3>
                <form onSubmit={handleUpiSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                    <input
                      type="text"
                      value={upiSettings.upiId}
                      onChange={(e) => setUpiSettings({ ...upiSettings, upiId: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="username@bank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                      type="text"
                      value={upiSettings.name}
                      onChange={(e) => setUpiSettings({ ...upiSettings, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <input
                      type="text"
                      value={upiSettings.bankName}
                      onChange={(e) => setUpiSettings({ ...upiSettings, bankName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your Bank Name"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save UPI Settings
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <div className="space-y-4">
                  {/* Add payment history items here */}
                  <p className="text-gray-500 text-center">No payment history available</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}