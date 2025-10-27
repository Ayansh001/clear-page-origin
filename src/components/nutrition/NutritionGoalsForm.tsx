
import { useState } from 'react';
import { NutritionGoal } from '@/lib/types';
import NutrientInput from './form/NutrientInput';
import FormActions from './form/FormActions';

interface NutritionGoalsFormProps {
  currentGoals: NutritionGoal;
  onSaveGoals: (goals: NutritionGoal) => void;
  onCancel: () => void;
}

const NutritionGoalsForm = ({ 
  currentGoals, 
  onSaveGoals, 
  onCancel 
}: NutritionGoalsFormProps) => {
  const [goals, setGoals] = useState<NutritionGoal>(currentGoals);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = () => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (goals.calories <= 0) newErrors.calories = 'Must be greater than 0';
    if (goals.protein <= 0) newErrors.protein = 'Must be greater than 0';
    if (goals.carbs <= 0) newErrors.carbs = 'Must be greater than 0';
    if (goals.fats <= 0) newErrors.fats = 'Must be greater than 0';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSaveGoals(goals);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
      <h4 className="text-sm font-medium">Set Nutrition Goals</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <NutrientInput 
          label="Daily Calories"
          value={goals.calories}
          onChange={(value) => setGoals(prev => ({ ...prev, calories: value }))}
          error={errors.calories}
          min={1}
          step="10"
        />
        <NutrientInput 
          label="Protein (g)"
          value={goals.protein}
          onChange={(value) => setGoals(prev => ({ ...prev, protein: value }))}
          error={errors.protein}
          min={1}
        />
        <NutrientInput 
          label="Carbs (g)"
          value={goals.carbs}
          onChange={(value) => setGoals(prev => ({ ...prev, carbs: value }))}
          error={errors.carbs}
          min={1}
        />
        <NutrientInput 
          label="Fats (g)"
          value={goals.fats}
          onChange={(value) => setGoals(prev => ({ ...prev, fats: value }))}
          error={errors.fats}
          min={1}
        />
      </div>
      
      <FormActions 
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isValid={true}
      />
    </div>
  );
};

export default NutritionGoalsForm;
