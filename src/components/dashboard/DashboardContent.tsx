
import { WaterIntake, NutritionItem, ProgressData } from '@/lib/types';
import WaterTracker from '../WaterTracker';
import NutritionTracker from '../nutrition/NutritionTracker';
import ProgressChart from '../ProgressChart';

interface DashboardContentProps {
  waterIntake: number;
  waterGoal: number;
  nutritionItems: NutritionItem[];
  progressData: ProgressData[];
  onWaterChange: (amount: number) => void;
  onAddNutritionItem: (item: Omit<NutritionItem, 'id' | 'timestamp'>) => void;
}

const DashboardContent = ({
  waterIntake,
  waterGoal,
  nutritionItems,
  progressData,
  onWaterChange,
  onAddNutritionItem
}: DashboardContentProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <WaterTracker
          currentAmount={waterIntake}
          goalAmount={waterGoal}
          onAmountChange={onWaterChange}
        />
        
        <NutritionTracker
          nutritionItems={nutritionItems}
          onAddItem={onAddNutritionItem}
        />
      </div>
      
      <div className="glass-card p-6">
        <h3 className="section-heading">Weekly Progress</h3>
        <ProgressChart data={progressData} />
      </div>
    </>
  );
};

export default DashboardContent;
