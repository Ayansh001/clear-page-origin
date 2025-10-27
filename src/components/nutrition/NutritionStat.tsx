
import { Progress } from '@/components/ui/progress';

interface NutritionStatProps {
  name: string;
  value: number;
  unit: string;
  color: string;
  goal?: number;
}

const NutritionStat = ({ name, value, unit, color, goal }: NutritionStatProps) => {
  const calculatePercentage = () => {
    if (!goal || goal <= 0) return 0;
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  const percentage = goal ? calculatePercentage() : null;

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-muted-foreground">{name}</span>
        {goal && <span className="text-xs">{percentage}%</span>}
      </div>
      <div className="flex items-baseline mt-1">
        <span className="text-lg font-semibold">{value}</span>
        <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      </div>
      
      {goal && (
        <div className="mt-1">
          <Progress 
            value={percentage || 0} 
            className={`h-1.5 ${color.replace('bg-', 'bg-opacity-30 ')} [&>div]:${color}`} 
          />
          <div className="text-xs text-muted-foreground mt-1">
            Goal: {goal}{unit}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionStat;
