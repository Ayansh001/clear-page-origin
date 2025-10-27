
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NutritionTracker from '@/components/nutrition/NutritionTracker';
import DailySummary from '@/components/nutrition/DailySummary';
import NutritionTips from '@/components/nutrition/NutritionTips';
import WeeklyNutrition from '@/components/nutrition/WeeklyNutrition';
import NutritionGoalsForm from '@/components/nutrition/NutritionGoalsForm';
import { NutritionItem, ProgressData, NutritionGoal, MealCategory } from '@/lib/types';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';
import { toast } from "sonner";

// Default nutritional goals based on average needs
const DEFAULT_NUTRITION_GOALS: NutritionGoal = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fats: 65
};

const Nutrition = () => {
  // Load data from localStorage with fallback to initial values
  const [nutritionItems, setNutritionItems] = useState<NutritionItem[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.NUTRITION_ITEMS, [
      {
        id: '1',
        name: 'Breakfast Smoothie',
        calories: 350,
        protein: 15,
        carbs: 45,
        fats: 10,
        timestamp: new Date(),
        isVegetarian: true,
        category: 'breakfast' as MealCategory
      },
      {
        id: '2',
        name: 'Grilled Chicken Salad',
        calories: 420,
        protein: 35,
        carbs: 25,
        fats: 18,
        timestamp: new Date(),
        isVegetarian: false,
        category: 'lunch' as MealCategory
      }
    ])
  );
  
  // Load progress data from localStorage with fallback
  const [progressData, setProgressData] = useState<ProgressData[]>(() => {
    // Get stored data or use default
    const storedData = loadFromLocalStorage<ProgressData[]>(STORAGE_KEYS.PROGRESS_DATA, []);
    
    if (storedData.length > 0) {
      return storedData;
    }
    
    // Generate last 7 days of empty data
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      
      result.push({
        date: dayName,
        water: 0,
        calories: i === 0 ? nutritionItems.reduce((sum, item) => sum + item.calories, 0) : 0,
        protein: i === 0 ? nutritionItems.reduce((sum, item) => sum + item.protein, 0) : 0,
        carbs: i === 0 ? nutritionItems.reduce((sum, item) => sum + item.carbs, 0) : 0,
        fats: i === 0 ? nutritionItems.reduce((sum, item) => sum + item.fats, 0) : 0
      });
    }
    
    return result;
  });
  
  // Load nutrition goals from localStorage with fallback
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal>(() => 
    loadFromLocalStorage(STORAGE_KEYS.NUTRITION_GOALS, DEFAULT_NUTRITION_GOALS)
  );
  
  // State for showing goals form
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.NUTRITION_ITEMS, nutritionItems);
    
    // Update today's progress data
    const updatedProgressData = [...progressData];
    const todayIndex = updatedProgressData.length - 1;
    
    if (todayIndex >= 0) {
      updatedProgressData[todayIndex] = {
        ...updatedProgressData[todayIndex],
        calories: nutritionItems.reduce((sum, item) => sum + item.calories, 0),
        protein: nutritionItems.reduce((sum, item) => sum + item.protein, 0),
        carbs: nutritionItems.reduce((sum, item) => sum + item.carbs, 0),
        fats: nutritionItems.reduce((sum, item) => sum + item.fats, 0)
      };
      
      setProgressData(updatedProgressData);
      saveToLocalStorage(STORAGE_KEYS.PROGRESS_DATA, updatedProgressData);
    }
  }, [nutritionItems]);
  
  // Save goals when they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.NUTRITION_GOALS, nutritionGoals);
  }, [nutritionGoals]);
  
  const handleAddNutritionItem = (item: Omit<NutritionItem, 'id' | 'timestamp'>) => {
    try {
      const newItem: NutritionItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      };
      
      setNutritionItems((prev) => [...prev, newItem]);
      toast.success("Food item added successfully");
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    }
  };
  
  const handleDeleteNutritionItem = (id: string) => {
    try {
      setNutritionItems((prev) => prev.filter(item => item.id !== id));
      toast.success("Food item deleted");
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
    }
  };
  
  const handleExportData = () => {
    try {
      const exportData = {
        nutritionItems,
        goals: nutritionGoals,
        exportDate: new Date()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `nutrition-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Nutrition data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export nutrition data");
    }
  };
  
  const handleImportData = (fileInput: HTMLInputElement) => {
    try {
      const file = fileInput.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result !== 'string') return;
          
          const importedData = JSON.parse(result);
          
          if (Array.isArray(importedData.nutritionItems)) {
            // Convert string dates back to Date objects
            const processedItems = importedData.nutritionItems.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }));
            
            setNutritionItems(processedItems);
          }
          
          if (importedData.goals) {
            setNutritionGoals(importedData.goals);
          }
          
          toast.success("Nutrition data imported successfully");
        } catch (error) {
          console.error("Error parsing imported data:", error);
          toast.error("Failed to parse imported data");
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("Failed to import nutrition data");
    }
  };
  
  const handleSaveGoals = (goals: NutritionGoal) => {
    setNutritionGoals(goals);
    setShowGoalsForm(false);
    toast.success("Nutrition goals updated");
  };

  // Add page entrance animation
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);
  
  // Calculate nutrition totals
  const nutritionTotals = nutritionItems.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fats += item.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-24 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Nutrition Tracking</h1>
            <p className="text-muted-foreground mt-2">Monitor your dietary intake</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <NutritionTracker
                nutritionItems={nutritionItems}
                onAddItem={handleAddNutritionItem}
                onDeleteItem={handleDeleteNutritionItem}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />
            </div>
            
            <div>
              {showGoalsForm ? (
                <div className="glass-card p-6 mb-6">
                  <NutritionGoalsForm 
                    currentGoals={nutritionGoals}
                    onSaveGoals={handleSaveGoals}
                    onCancel={() => setShowGoalsForm(false)}
                  />
                </div>
              ) : (
                <DailySummary 
                  nutritionTotals={nutritionTotals} 
                  nutritionGoals={nutritionGoals}
                  onSetGoals={() => setShowGoalsForm(true)}
                />
              )}
              <NutritionTips />
            </div>
          </div>
          
          <WeeklyNutrition progressData={progressData} />
        </div>
      </main>
    </div>
  );
};

export default Nutrition;
