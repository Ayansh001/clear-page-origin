
import { Progress } from '@/components/ui/progress';
import NutritionStat from './NutritionStat';
import { NutritionGoal } from '@/lib/types';

interface DailySummaryProps {
  nutritionTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  nutritionGoals?: NutritionGoal;
  onSetGoals: () => void;
}

const DailySummary = ({ nutritionTotals, nutritionGoals, onSetGoals }: DailySummaryProps) => {
  const calculatePercentage = (current: number, goal: number) => {
    if (!goal || goal <= 0) return 0;
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    return percentage;
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="section-heading">Daily Summary</h3>
        <button 
          onClick={onSetGoals}
          className="text-xs text-primary hover:underline"
        >
          {nutritionGoals ? 'Update Goals' : 'Set Goals'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Calories</h4>
              <div className="flex items-baseline">
                <span className="stat-value">{nutritionTotals.calories}</span>
                <span className="text-sm text-muted-foreground ml-1">kcal</span>
              </div>
            </div>
            
            {nutritionGoals && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground">
                  Goal: {nutritionGoals.calories} kcal
                </span>
                <span className="text-xs ml-2 font-medium">
                  {calculatePercentage(nutritionTotals.calories, nutritionGoals.calories)}%
                </span>
              </div>
            )}
          </div>
          
          {nutritionGoals && (
            <Progress 
              value={calculatePercentage(nutritionTotals.calories, nutritionGoals.calories)} 
              className="h-2 mt-2" 
            />
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <NutritionStat
            name="Protein"
            value={nutritionTotals.protein}
            unit="g"
            color="bg-protein-500"
            goal={nutritionGoals?.protein}
          />
          <NutritionStat
            name="Carbs"
            value={nutritionTotals.carbs}
            unit="g"
            color="bg-carbs-500"
            goal={nutritionGoals?.carbs}
          />
          <NutritionStat
            name="Fats"
            value={nutritionTotals.fats}
            unit="g"
            color="bg-fats-500"
            goal={nutritionGoals?.fats}
          />
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
