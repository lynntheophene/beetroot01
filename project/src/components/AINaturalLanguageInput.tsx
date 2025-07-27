import React, { useState } from 'react';
import { Brain, Send, Mic, MicOff } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';

export function AINaturalLanguageInput() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { processNaturalLanguageInput } = useCalorieStore();

  const exampleCommands = [
    "I had a large apple and 2 slices of bread for breakfast",
    "Add 250ml of water",
    "Log 100g chicken breast for lunch",
    "I want to add a feature for meal planning",
    "Track my weight as 70kg today"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      await processNaturalLanguageInput(input);
      setInput('');
      setSuggestions([]);
    } catch (error) {
      console.error('Failed to process input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Simple suggestion logic based on keywords
    if (value.length > 3) {
      const keywords = value.toLowerCase();
      const newSuggestions = exampleCommands.filter(cmd => 
        cmd.toLowerCase().includes(keywords) || 
        keywords.split(' ').some(word => cmd.toLowerCase().includes(word))
      ).slice(0, 3);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
          BETA
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Tell me what you ate, track water, log weight, or request new features using natural language!
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="e.g., 'I had a large apple and 2 slices of bread for breakfast' or 'Add a meal planning feature'"
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
            disabled={isProcessing}
          />
          
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isProcessing || isListening}
            className={`absolute top-3 right-12 p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute top-3 right-3 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-purple-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm">Processing your request...</span>
          </div>
        )}

        {/* Voice Listening Indicator */}
        {isListening && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="animate-pulse rounded-full h-4 w-4 bg-red-600"></div>
            <span className="text-sm">Listening... Speak now!</span>
          </div>
        )}
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example Commands */}
      {!input && suggestions.length === 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exampleCommands.slice(0, 4).map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="text-left px-3 py-2 text-sm text-gray-600 bg-white rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feature Info */}
      <div className="mt-6 pt-4 border-t border-purple-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="text-xs text-gray-600">
            <div className="font-medium text-purple-600">🍎 Food Logging</div>
            <div>Natural language food tracking</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-medium text-blue-600">💧 Quick Actions</div>
            <div>Water, weight, exercise logging</div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-medium text-green-600">✨ Feature Requests</div>
            <div>AI-powered feature suggestions</div>
          </div>
        </div>
      </div>
    </div>
  );
}