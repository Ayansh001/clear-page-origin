
import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { getFoodNutrition, getFoodSuggestions } from '@/services/nutritionService';
import { MealCategory } from '@/lib/types';
import FoodInputField from './form/FoodInputField';
import NutrientInput from './form/NutrientInput';
import FormActions from './form/FormActions';
import CategorySelect from './form/CategorySelect';

interface AddFoodFormProps {
  onAddFood: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    isVegetarian: boolean;
    category: MealCategory;
  }) => void;
  onCancel: () => void;
}

const AddFoodForm = ({ onAddFood, onCancel }: AddFoodFormProps) => {
  const [newFood, setNewFood] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    isVegetarian: false,
    category: 'other' as MealCategory
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Determine default meal category based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let defaultCategory: MealCategory = 'other';
    
    if (hour >= 5 && hour < 11) {
      defaultCategory = 'breakfast';
    } else if (hour >= 11 && hour < 15) {
      defaultCategory = 'lunch';
    } else if (hour >= 17 && hour < 21) {
      defaultCategory = 'dinner';
    } else if ((hour >= 15 && hour < 17) || (hour >= 21 || hour < 5)) {
      defaultCategory = 'snack';
    }
    
    setNewFood(prev => ({ ...prev, category: defaultCategory }));
    
    // Get food suggestions
    try {
      setSuggestions(getFoodSuggestions());
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
    }
  }, []);

  // Function to auto-populate nutrition data when food name changes
  const handleFoodNameChange = (foodName: string) => {
    setNewFood(prev => ({ ...prev, name: foodName }));
    setErrors(prev => ({ ...prev, name: '' }));
    
    // If food name is empty, reset values
    if (!foodName.trim()) {
      setNewFood(prev => ({
        ...prev,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        isVegetarian: false
      }));
      return;
    }
    
    // Check if we have nutrition data for this food
    try {
      const nutritionData = getFoodNutrition(foodName);
      if (nutritionData) {
        // Auto-populate with the data
        setNewFood(prev => ({
          ...prev,
          name: nutritionData.name || foodName,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          carbs: nutritionData.carbs,
          fats: nutritionData.fats,
          isVegetarian: nutritionData.isVegetarian || false
        }));
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!newFood.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    
    if (newFood.calories < 0) {
      newErrors.calories = 'Calories cannot be negative';
    }
    
    if (newFood.protein < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }
    
    if (newFood.carbs < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }
    
    if (newFood.fats < 0) {
      newErrors.fats = 'Fats cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onAddFood(newFood);
    }
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 mb-4 animate-fade-in">
      <div className="space-y-3">
        <FoodInputField 
          value={newFood.name}
          suggestions={suggestions}
          onChange={handleFoodNameChange}
          onError={(error) => handleFieldError('name', error)}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <CategorySelect
            value={newFood.category}
            onChange={(category) => setNewFood(prev => ({ ...prev, category }))}
          />
          <NutrientInput 
            label="Calories"
            value={newFood.calories}
            onChange={(value) => setNewFood(prev => ({ ...prev, calories: value }))}
            error={errors.calories}
            step="1"
          />
          <NutrientInput 
            label="Protein (g)"
            value={newFood.protein}
            onChange={(value) => setNewFood(prev => ({ ...prev, protein: value }))}
            error={errors.protein}
          />
          <NutrientInput 
            label="Carbs (g)"
            value={newFood.carbs}
            onChange={(value) => setNewFood(prev => ({ ...prev, carbs: value }))}
            error={errors.carbs}
          />
          <NutrientInput 
            label="Fats (g)"
            value={newFood.fats}
            onChange={(value) => setNewFood(prev => ({ ...prev, fats: value }))}
            error={errors.fats}
          />
        </div>
        
        <div className="flex items-center mt-2">
          <label className="text-xs font-medium flex items-center gap-2">
            <input
              type="checkbox"
              checked={newFood.isVegetarian}
              onChange={(e) => setNewFood({ ...newFood, isVegetarian: e.target.checked })}
              className="rounded border-border"
            />
            <span className="flex items-center gap-1">
              <Leaf size={14} className="text-green-500" /> Vegetarian
            </span>
          </label>
        </div>
        
        <FormActions 
          onCancel={onCancel}
          onSubmit={handleSubmit}
          isValid={!!newFood.name.trim()}
        />
      </div>
    </div>
  );
};

export default AddFoodForm;
