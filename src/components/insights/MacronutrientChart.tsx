
import { useTheme } from '@/hooks/use-theme';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface MacronutrientChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const MacronutrientChart = ({ data }: MacronutrientChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const tooltipStyle = {
    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    backdropFilter: 'blur(8px)',
    border: isDark ? '1px solid rgba(80, 80, 80, 0.3)' : '1px solid rgba(220, 220, 220, 0.5)',
    color: isDark ? '#fff' : '#000'
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}g`, '']}
            labelStyle={{ color: isDark ? '#ccc' : '#333' }}
          />
          <Legend 
            formatter={(value) => <span style={{ fontSize: '0.875rem', color: isDark ? '#ddd' : '#333' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacronutrientChart;
