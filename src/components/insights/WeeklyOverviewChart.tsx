
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WeeklyOverviewChartProps {
  data: {
    name: string;
    water: number;
    nutrition: number;
  }[];
}

const WeeklyOverviewChart = ({ data }: WeeklyOverviewChartProps) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={30} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="water" 
            name="Water (ml)" 
            stroke="#2196F3" 
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="nutrition" 
            name="Calories (kcal)" 
            stroke="#9CCC65" 
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyOverviewChart;
