import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, Award, Users, Target, Zap, Heart } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'calories' | 'macros' | 'weight' | 'habits'>('calories');

  const { 
    nutritionLogs, 
    weightEntries, 
    analyzeEatingPatterns,
    streaks,
    achievements 
  } = useCalorieStore();

  const patterns = analyzeEatingPatterns();

  // Mock data for demonstration - in real app this would come from actual data
  const weeklyCalorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Consumed',
        data: [1850, 2100, 1950, 2200, 1800, 2300, 2000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Calorie Goal',
        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const macroDistribution = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [25, 45, 30],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const habitData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Days Goal Met',
        data: [5, 6, 7, 6],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Days Over Goal',
        data: [2, 1, 0, 1],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const insights = [
    {
      icon: TrendingUp,
      title: 'Calorie Consistency',
      value: '85%',
      description: 'You\'ve stayed within 10% of your goal most days',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Heart,
      title: 'Protein Intake',
      value: 'Good',
      description: 'Meeting 90% of protein targets on average',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Calendar,
      title: 'Meal Timing',
      value: 'Regular',
      description: 'Consistent meal times help metabolism',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Zap,
      title: 'Energy Balance',
      value: 'Stable',
      description: 'Good balance between intake and activity',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recommendations = [
    {
      category: 'Nutrition',
      suggestions: [
        'Add more fiber-rich foods to improve satiety',
        'Include omega-3 rich foods twice per week',
        'Consider meal prep to maintain consistency'
      ]
    },
    {
      category: 'Timing',
      suggestions: [
        'Try to eat your largest meal earlier in the day',
        'Maintain 12-hour eating windows',
        'Avoid late-night snacking'
      ]
    },
    {
      category: 'Goals',
      suggestions: [
        'Increase protein by 10g daily',
        'Reduce processed food intake',
        'Drink water before meals'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600">Deep insights into your nutrition and health patterns</p>
          </div>
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${insight.bgColor}`}>
                  <Icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{insight.title}</h3>
              </div>
              <p className={`text-2xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calorie Trends</h2>
          <div className="h-64">
            <Line 
              data={weeklyCalorieData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 1500,
                    max: 2500
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Macro Distribution</h2>
          <div className="h-64">
            <Doughnut 
              data={macroDistribution}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Habit Tracking */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Goal Achievement</h2>
          <div className="h-64">
            <Bar 
              data={habitData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 7
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Streaks & Achievements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Weekly Champion</p>
                  <p className="text-sm text-gray-600">7 days in a row!</p>
                </div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Goal Crusher</p>
                  <p className="text-sm text-gray-600">10 goals achieved</p>
                </div>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Community Helper</p>
                  <p className="text-sm text-gray-600">Helped 5 users</p>
                </div>
              </div>
              <span className="text-2xl">🤝</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{rec.category}</h3>
              <ul className="space-y-2">
                {rec.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export & Sharing</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Export PDF Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Share Progress
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Connect Health Apps
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
}