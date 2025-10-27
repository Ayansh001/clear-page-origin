
import ProgressChart from '@/components/ProgressChart';
import { ProgressData } from '@/lib/types';

interface WeeklyNutritionProps {
  progressData: ProgressData[];
}

const WeeklyNutrition = ({ progressData }: WeeklyNutritionProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="section-heading">Weekly Nutrition</h3>
      <ProgressChart data={progressData} />
    </div>
  );
};

export default WeeklyNutrition;
