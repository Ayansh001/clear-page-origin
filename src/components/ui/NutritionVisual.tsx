
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
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
  
  const CustomLabel = ({ viewBox, value1, value2, value3 }: any) => {
    const { cx, cy } = viewBox;
    const radius = size === 'sm' ? 65 : size === 'md' ? 85 : 105;
    
    // Calculate positions in a circle
    const angle1 = -90; // Top
    const angle2 = 30; // Right
    const angle3 = 150; // Left
    
    const getPosition = (angle: number) => {
      const radian = (angle * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(radian),
        y: cy + radius * Math.sin(radian)
      };
    };
    
    const pos1 = getPosition(angle1);
    const pos2 = getPosition(angle2);
    const pos3 = getPosition(angle3);
    
    const fontSize = size === 'sm' ? 10 : size === 'md' ? 11 : 12;
    
    return (
      <g>
        {value1 && (
          <text x={pos1.x} y={pos1.y} textAnchor="middle" className="fill-foreground" fontSize={fontSize} fontWeight="600">
            {value1}
          </text>
        )}
        {value2 && (
          <text x={pos2.x} y={pos2.y} textAnchor="middle" className="fill-foreground" fontSize={fontSize} fontWeight="600">
            {value2}
          </text>
        )}
        {value3 && (
          <text x={pos3.x} y={pos3.y} textAnchor="middle" className="fill-foreground" fontSize={fontSize} fontWeight="600">
            {value3}
          </text>
        )}
      </g>
    );
  };
  
  return (
    <div className={cn('w-full', sizes[size], className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
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
            <Label 
              content={<CustomLabel 
                value1={total > 0 ? `${protein}g Protein` : null}
                value2={total > 0 ? `${carbs}g Carbs` : null}
                value3={total > 0 ? `${fats}g Fats` : null}
              />}
              position="center" 
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionVisual;
