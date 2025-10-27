
import { useState, useEffect } from 'react';
import { NutritionItem, ProgressData } from '@/lib/types';
import DashboardOverview from './dashboard/DashboardOverview';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard = () => {
  // Mock data and state for the demo
  const [waterGoal] = useState(2000); // 2000ml water goal
  const [waterIntake, setWaterIntake] = useState(800); // Current water intake
  
  const [nutritionItems, setNutritionItems] = useState<NutritionItem[]>([
    {
      id: '1',
      name: 'Breakfast Smoothie',
      calories: 350,
      protein: 15,
      carbs: 45,
      fats: 10,
      timestamp: new Date()
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 420,
      protein: 35,
      carbs: 25,
      fats: 18,
      timestamp: new Date()
    }
  ]);
  
  // Sample progress data for the chart
  const [progressData] = useState<ProgressData[]>([
    {
      date: 'Mon',
      water: 1500,
      calories: 1800,
      protein: 90,
      carbs: 220,
      fats: 60
    },
    {
      date: 'Tue',
      water: 1700,
      calories: 2100,
      protein: 95,
      carbs: 240,
      fats: 65
    },
    {
      date: 'Wed',
      water: 1600,
      calories: 1950,
      protein: 100,
      carbs: 210,
      fats: 60
    },
    {
      date: 'Thu',
      water: 2000,
      calories: 2200,
      protein: 110,
      carbs: 250,
      fats: 70
    },
    {
      date: 'Fri',
      water: 1900,
      calories: 2000,
      protein: 105,
      carbs: 230,
      fats: 65
    },
    {
      date: 'Sat',
      water: waterIntake, // Today's progress
      calories: nutritionItems.reduce((sum, item) => sum + item.calories, 0),
      protein: nutritionItems.reduce((sum, item) => sum + item.protein, 0),
      carbs: nutritionItems.reduce((sum, item) => sum + item.carbs, 0),
      fats: nutritionItems.reduce((sum, item) => sum + item.fats, 0)
    }
  ]);
  
  const handleWaterChange = (amount: number) => {
    setWaterIntake(amount);
  };
  
  const handleAddNutritionItem = (item: Omit<NutritionItem, 'id' | 'timestamp'>) => {
    const newItem: NutritionItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    setNutritionItems((prev) => [...prev, newItem]);
  };
  
  const handleDeleteNutritionItem = (id: string) => {
    setNutritionItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleExportData = () => {
    const dataStr = JSON.stringify(nutritionItems, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'nutrition-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportData = (fileInput: HTMLInputElement) => {
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) {
            setNutritionItems(imported);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="mt-24 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Daily Overview</h1>
        <p className="text-muted-foreground mt-2">Track your water and nutrition intake</p>
      </div>
      
      <DashboardOverview 
        waterIntake={waterIntake}
        waterGoal={waterGoal}
        nutritionItems={nutritionItems}
      />
      
      <DashboardContent
        waterIntake={waterIntake}
        waterGoal={waterGoal}
        nutritionItems={nutritionItems}
        progressData={progressData}
        onWaterChange={handleWaterChange}
        onAddNutritionItem={handleAddNutritionItem}
        onDeleteNutritionItem={handleDeleteNutritionItem}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
    </div>
  );
};

export default Dashboard;
