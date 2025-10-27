
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import QuoteDisplay from '@/components/insights/QuoteDisplay';
import ChartContainer from '@/components/insights/ChartContainer';
import WeeklyOverviewChart from '@/components/insights/WeeklyOverviewChart';
import MacronutrientChart from '@/components/insights/MacronutrientChart';
import MicronutrientChart from '@/components/insights/MicronutrientChart';
import InsightCard from '@/components/insights/InsightCard';

const Insights = () => {
  const [quote, setQuote] = useState("");
  
  const weeklyData = [
    { name: 'Mon', water: 1500, nutrition: 1800 },
    { name: 'Tue', water: 1700, nutrition: 2100 },
    { name: 'Wed', water: 1600, nutrition: 1950 },
    { name: 'Thu', water: 2000, nutrition: 2200 },
    { name: 'Fri', water: 1900, nutrition: 2000 },
    { name: 'Sat', water: 1800, nutrition: 1900 },
    { name: 'Sun', water: 2100, nutrition: 2150 },
  ];
  
  const macroData = [
    { name: 'Protein', value: 110, color: '#FFA726' },
    { name: 'Carbs', value: 230, color: '#5C6BC0' },
    { name: 'Fats', value: 65, color: '#EC407A' },
  ];
  
  const nutrientData = [
    { name: 'Vitamin A', amount: 85 },
    { name: 'Vitamin C', amount: 92 },
    { name: 'Vitamin D', amount: 65 },
    { name: 'Calcium', amount: 78 },
    { name: 'Iron', amount: 72 },
    { name: 'Magnesium', amount: 60 },
  ];

  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    
    const quotes = [
      "The only bad workout is the one that didn't happen.",
      "Fitness is not about being better than someone else. It's about being better than you used to be.",
      "Take care of your body. It's the only place you have to live.",
      "The hardest lift of all is lifting your butt off the couch.",
      "Your body can stand almost anything. It's your mind that you have to convince."
    ];
    
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);
  
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartContainer title="Weekly Overview">
              <WeeklyOverviewChart data={weeklyData} />
            </ChartContainer>
            
            <ChartContainer title="Macronutrient Breakdown">
              <MacronutrientChart data={macroData} />
            </ChartContainer>
          </div>
          
          <ChartContainer title="Micronutrient Intake">
            <MicronutrientChart data={nutrientData} />
          </ChartContainer>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <InsightCard
              title="Hydration Patterns"
              description="You tend to drink more water in the morning and early afternoon. Consider increasing your evening intake."
              metric="Best Day"
              value="Thursday"
            />
            
            <InsightCard
              title="Protein Intake"
              description="Your protein consumption is consistently meeting daily requirements, great for muscle maintenance."
              metric="Avg. Daily"
              value="105g"
            />
            
            <InsightCard
              title="Caloric Balance"
              description="Your calorie intake has been consistent this week, maintaining a healthy metabolic rate."
              metric="Weekly Avg."
              value="2,015 kcal"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Insights;
