
import NutritionVisual from '../ui/NutritionVisual';
import MacroStat from './MacroStat';
import { NutritionItem } from '@/lib/types';

interface NutritionSummaryProps {
  nutritionItems: NutritionItem[];
}

const NutritionSummary = ({ nutritionItems }: NutritionSummaryProps) => {
  // Calculate totals
  const totals = nutritionItems.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fats += item.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col items-center">
        <NutritionVisual 
          data={{ 
            protein: totals.protein, 
            carbs: totals.carbs, 
            fats: totals.fats 
          }} 
          size="lg" 
        />
        <span className="text-sm text-muted-foreground mt-2">
          Macronutrient Breakdown
        </span>
      </div>
      
      <div className="flex flex-col items-center md:items-start space-y-4">
        <div className="text-center md:text-left">
          <h4 className="text-sm font-medium text-muted-foreground">Daily Calories</h4>
          <div className="flex items-baseline">
            <span className="stat-value">{totals.calories}</span>
            <span className="text-sm text-muted-foreground ml-1">kcal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-2">
          <MacroStat 
            name="Protein" 
            value={totals.protein} 
            color="bg-protein-500" 
          />
          <MacroStat 
            name="Carbs" 
            value={totals.carbs} 
            color="bg-carbs-500" 
          />
          <MacroStat 
            name="Fats" 
            value={totals.fats} 
            color="bg-fats-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
