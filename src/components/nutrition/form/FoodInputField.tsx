
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface FoodInputFieldProps {
  value: string;
  suggestions: string[];
  onChange: (value: string) => void;
  onError: (error: string) => void;
}

const FoodInputField = ({ value, suggestions, onChange, onError }: FoodInputFieldProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  
  const filteredSuggestions = suggestions
    .filter(food => food.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 5); // Limit to 5 suggestions
  
  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    if (!newValue.trim()) {
      setError('Food name is required');
      onError('Food name is required');
    } else {
      setError('');
      onError('');
    }
  };
  
  return (
    <div className="relative">
      <label className="text-xs font-medium block mb-1">
        Food Name <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={error ? "border-red-500" : ""}
        placeholder="e.g. Chicken Salad or search our database"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      
      {/* Food suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
              onClick={() => handleChange(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodInputField;
