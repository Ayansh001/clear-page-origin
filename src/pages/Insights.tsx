import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import InsightCard from '@/components/insights/InsightCard';
import QuoteDisplay from '@/components/insights/QuoteDisplay';
import MacronutrientChart from '@/components/insights/MacronutrientChart';
import MicronutrientChart from '@/components/insights/MicronutrientChart';
import WeeklyOverviewChart from '@/components/insights/WeeklyOverviewChart';
import ChartContainer from '@/components/insights/ChartContainer';
import { progressService } from '@/services/progressService';

const Insights = () => {
  const { data: progressData = [], isLoading } = useQuery({
    queryKey: ['progress-weekly'],
    queryFn: () => progressService.getWeeklyProgress()
  });

  const totalCalories = progressData.reduce((sum, day) => sum + day.calories, 0);
  const totalProtein = progressData.reduce((sum, day) => sum + day.protein, 0);
  const totalCarbs = progressData.reduce((sum, day) => sum + day.carbs, 0);
  const totalFats = progressData.reduce((sum, day) => sum + day.fats, 0);
  const totalWater = progressData.reduce((sum, day) => sum + day.water, 0);
  
  const avgCalories = Math.round(totalCalories / (progressData.length || 1));
  const avgProtein = Math.round(totalProtein / (progressData.length || 1));
  const avgWater = Math.round(totalWater / (progressData.length || 1));

  const macroData = [
    { name: 'Protein', value: totalProtein, color: '#FFA726' },
    { name: 'Carbs', value: totalCarbs, color: '#5C6BC0' },
    { name: 'Fats', value: totalFats, color: '#EC407A' },
  ];

  const weeklyData = progressData.map(day => ({
    name: day.date,
    water: day.water,
    nutrition: day.calories
  }));

  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Take care of your body. It's the only place you have to live.",
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-24 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Insights</h1>
            <p className="text-muted-foreground mt-2">Visualize your health and nutrition data</p>
            <QuoteDisplay quote={quote} />
          </div>
          
          {isLoading ? (
            <div className="glass-card p-6">Loading insights...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartContainer title="Weekly Overview">
                  <WeeklyOverviewChart data={weeklyData} />
                </ChartContainer>
                
                <ChartContainer title="Macronutrient Breakdown">
                  <MacronutrientChart data={macroData} />
                </ChartContainer>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <InsightCard
                  title="Average Calories"
                  description="Your daily calorie intake averaged over the week"
                  metric="Weekly Avg."
                  value={`${avgCalories} kcal`}
                />
                
                <InsightCard
                  title="Protein Intake"
                  description="Your weekly protein consumption"
                  metric="Avg. Daily"
                  value={`${avgProtein}g`}
                />
                
                <InsightCard
                  title="Hydration"
                  description="Your average daily water intake"
                  metric="Daily Avg."
                  value={`${avgWater}ml`}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Insights;
