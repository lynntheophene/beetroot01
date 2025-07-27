import React, { useState } from 'react';
import { Scale, TrendingUp, TrendingDown, Target, Calendar, Camera } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function WeightTrackingPage() {
  const [newWeight, setNewWeight] = useState('');
  const [weightGoal, setWeightGoal] = useState(70);
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { weightEntries, logWeight, getWeightProgress } = useCalorieStore();

  const recentEntries = getWeightProgress();
  const currentWeight = recentEntries[0]?.weight || 0;
  const previousWeight = recentEntries[1]?.weight || currentWeight;
  const weightChange = currentWeight - previousWeight;
  const weightDifference = currentWeight - weightGoal;

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    logWeight({
      weight: parseFloat(newWeight),
      date: new Date(),
      notes: notes || undefined
    });

    setNewWeight('');
    setNotes('');
    setShowForm(false);
  };

  // Prepare chart data
  const chartData = {
    labels: recentEntries.slice(0, 30).reverse().map(entry => 
      format(new Date(entry.date), 'MMM dd')
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: recentEntries.slice(0, 30).reverse().map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Goal',
        data: Array(recentEntries.slice(0, 30).length).fill(weightGoal),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight Progress (Last 30 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.min(...recentEntries.map(e => e.weight), weightGoal) - 5,
        max: Math.max(...recentEntries.map(e => e.weight), weightGoal) + 5
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weight Tracking</h1>
            <p className="text-gray-600">Monitor your weight progress and reach your goals</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Scale className="h-5 w-5" />
            <span>Log Weight</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Weight</p>
              <p className="text-3xl font-bold text-gray-900">{currentWeight.toFixed(1)}</p>
              <p className="text-xs text-gray-500">kg</p>
            </div>
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Goal Weight</p>
              <p className="text-3xl font-bold text-gray-900">{weightGoal}</p>
              <p className="text-xs text-gray-500">kg</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Change</p>
              <p className={`text-3xl font-bold ${weightChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">kg from last entry</p>
            </div>
            {weightChange >= 0 ? (
              <TrendingUp className="h-8 w-8 text-red-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-green-600" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">To Goal</p>
              <p className={`text-3xl font-bold ${weightDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(weightDifference).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500">
                kg {weightDifference > 0 ? 'to lose' : 'gained'}
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      {recentEntries.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Chart</h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
        
        {recentEntries.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No weight entries yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Log your first weight entry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Scale className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{entry.weight.toFixed(1)} kg</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-gray-500 italic">{entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {recentEntries.indexOf(entry) > 0 && (
                    <p className={`text-sm font-medium ${
                      entry.weight - recentEntries[recentEntries.indexOf(entry) + 1].weight >= 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {entry.weight - recentEntries[recentEntries.indexOf(entry) + 1].weight > 0 ? '+' : ''}
                      {(entry.weight - recentEntries[recentEntries.indexOf(entry) + 1].weight).toFixed(1)} kg
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weight Logging Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Log Weight</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLogWeight} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How are you feeling? Any observations?"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Log Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Setting */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weight Goal</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Target Weight:</label>
          <input
            type="number"
            step="0.1"
            value={weightGoal}
            onChange={(e) => setWeightGoal(parseFloat(e.target.value) || 70)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
          />
          <span className="text-sm text-gray-600">kg</span>
        </div>
      </div>
    </div>
  );
}