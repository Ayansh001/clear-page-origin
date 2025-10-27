
import { DropletIcon, UtensilsCrossedIcon, DumbbellIcon } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { NutritionItem } from '@/lib/types';

interface DashboardOverviewProps {
  waterIntake: number;
  waterGoal: number;
  nutritionItems: NutritionItem[];
}

const DashboardOverview = ({ waterIntake, waterGoal, nutritionItems }: DashboardOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <DashboardCard
        icon={<DropletIcon className="text-water-600" />}
        title="Water Intake"
        value={`${waterIntake} / ${waterGoal} ml`}
        progress={Math.min(100, Math.round((waterIntake / waterGoal) * 100))}
        progressColor="bg-water-500"
        linkTo="/water"
      />
      
      <DashboardCard
        icon={<UtensilsCrossedIcon className="text-nutrition-600" />}
        title="Nutrition"
        value={`${nutritionItems.reduce((sum, item) => sum + item.calories, 0)} kcal`}
        progress={75} // This would be based on calorie goals in a real app
        progressColor="bg-nutrition-500"
        linkTo="/nutrition"
      />
      
      <DashboardCard
        icon={<DumbbellIcon className="text-primary" />}
        title="Gym & Workouts"
        value="Track progress"
        progress={60} // This would be based on workout completion in a real app
        progressColor="bg-primary"
        linkTo="/gym"
      />
    </div>
  );
};

export default DashboardOverview;
