
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface NutritionVisualProps {
  data: {
    protein: number;
    carbs: number;
    fats: number;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NutritionVisual = ({ 
  data,
  size = 'md',
  className 
}: NutritionVisualProps) => {
  const { protein, carbs, fats } = data;
  const total = protein + carbs + fats;
  
  // Format data for the pie chart
  const chartData = [
    { name: 'Protein', value: protein, color: '#FFA726' },
    { name: 'Carbs', value: carbs, color: '#5C6BC0' },
    { name: 'Fats', value: fats, color: '#EC407A' },
  ].filter(item => item.value > 0);
  
  // If all values are 0, show empty state
  if (total === 0) {
    chartData.push({ name: 'No data', value: 1, color: '#E0E0E0' });
  }
  
  // Sizes
  const sizes = {
    sm: 'h-24',
    md: 'h-32',
    lg: 'h-40'
  };
  
  return (
    <div className={cn('w-full', sizes[size], className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={size === 'sm' ? 30 : size === 'md' ? 40 : 50}
            outerRadius={size === 'sm' ? 40 : size === 'md' ? 55 : 70}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-medium">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionVisual;
