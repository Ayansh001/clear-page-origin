
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { ProgressData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  data: ProgressData[];
  className?: string;
}

type ChartType = 'line' | 'area';
type MetricType = 'water' | 'calories' | 'protein' | 'carbs' | 'fats';

const ProgressChart = ({ data, className }: ProgressChartProps) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('water');
  const [chartType, setChartType] = useState<ChartType>('line');
  
  const metrics = [
    { id: 'water', name: 'Water', color: '#2196F3', unit: 'ml' },
    { id: 'calories', name: 'Calories', color: '#9C27B0', unit: 'kcal' },
    { id: 'protein', name: 'Protein', color: '#FFA726', unit: 'g' },
    { id: 'carbs', name: 'Carbs', color: '#5C6BC0', unit: 'g' },
    { id: 'fats', name: 'Fats', color: '#EC407A', unit: 'g' },
  ];
  
  const activeMetricInfo = metrics.find(m => m.id === activeMetric)!;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-2 text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-sm font-medium" style={{ color: activeMetricInfo.color }}>
            {payload[0].value} {activeMetricInfo.unit}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={cn('w-full', className)}>
      {/* Chart Type Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                activeMetric === metric.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              )}
              onClick={() => setActiveMetric(metric.id as MetricType)}
            >
              {metric.name}
            </button>
          ))}
        </div>
        
        <div className="flex rounded-md overflow-hidden">
          <button
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors',
              chartType === 'line'
                ? 'bg-foreground text-background'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors',
              chartType === 'area'
                ? 'bg-foreground text-background'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
            onClick={() => setChartType('area')}
          >
            Area
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeWidth: 0 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeWidth: 0 }}
                width={30}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={activeMetricInfo.color}
                strokeWidth={2}
                animationDuration={1000}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeWidth: 0 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ strokeWidth: 0 }}
                width={30}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={activeMetricInfo.color}
                fill={activeMetricInfo.color}
                fillOpacity={0.2}
                animationDuration={1000}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
