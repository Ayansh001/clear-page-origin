import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import NutritionTracker from '@/components/nutrition/NutritionTracker';
import DailySummary from '@/components/nutrition/DailySummary';
import NutritionTips from '@/components/nutrition/NutritionTips';
import WeeklyNutrition from '@/components/nutrition/WeeklyNutrition';
import NutritionGoalsForm from '@/components/nutrition/NutritionGoalsForm';
import { NutritionItem, ProgressData, NutritionGoal, MealCategory } from '@/lib/types';
import { nutritionService } from '@/services/nutritionService';
import { progressService } from '@/services/progressService';
import { toast } from "sonner";

// Default nutritional goals based on average needs
const DEFAULT_NUTRITION_GOALS: NutritionGoal = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fats: 65
};

const Nutrition = () => {
  const queryClient = useQueryClient();
  const [showGoalsForm, setShowGoalsForm] = useState(false);

  // Fetch nutrition items
  const { data: nutritionItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['nutrition-items'],
    queryFn: () => nutritionService.getNutritionItems()
  });

  // Fetch nutrition goals
  const { data: nutritionGoals, isLoading: goalsLoading } = useQuery({
    queryKey: ['nutrition-goals'],
    queryFn: async () => {
      const goals = await nutritionService.getNutritionGoals();
      return goals || DEFAULT_NUTRITION_GOALS;
    }
  });

  // Fetch weekly progress
  const { data: progressData = [] } = useQuery({
    queryKey: ['progress-weekly'],
    queryFn: () => progressService.getWeeklyProgress()
  });

  // Add nutrition item mutation
  const addItemMutation = useMutation({
    mutationFn: (item: Omit<NutritionItem, 'id' | 'timestamp'>) =>
      nutritionService.addNutritionItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-items'] });
      queryClient.invalidateQueries({ queryKey: ['progress-weekly'] });
      toast.success("Food item added successfully");
    },
    onError: (error) => {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item");
    }
  });

  // Delete nutrition item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => nutritionService.deleteNutritionItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-items'] });
      queryClient.invalidateQueries({ queryKey: ['progress-weekly'] });
      toast.success("Food item deleted");
    },
    onError: (error) => {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item");
    }
  });

  // Update goals mutation
  const updateGoalsMutation = useMutation({
    mutationFn: (goals: NutritionGoal) => nutritionService.updateNutritionGoals(goals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-goals'] });
      setShowGoalsForm(false);
      toast.success("Nutrition goals updated");
    },
    onError: (error) => {
      console.error("Error updating goals:", error);
      toast.error("Failed to update goals");
    }
  });
  
  const handleAddNutritionItem = (item: Omit<NutritionItem, 'id' | 'timestamp'>) => {
    addItemMutation.mutate(item);
  };
  
  const handleDeleteNutritionItem = (id: string) => {
    deleteItemMutation.mutate(id);
  };
  
  const handleExportData = async () => {
    try {
      const items = await nutritionService.getNutritionItems();
      const goals = await nutritionService.getNutritionGoals();
      
      const exportData = {
        nutritionItems: items,
        goals: goals || DEFAULT_NUTRITION_GOALS,
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
  
  const handleImportData = async (fileInput: HTMLInputElement) => {
    try {
      const file = fileInput.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (typeof result !== 'string') return;
          
          const importedData = JSON.parse(result);
          
          if (Array.isArray(importedData.nutritionItems)) {
            // Import each item
            for (const item of importedData.nutritionItems) {
              await nutritionService.addNutritionItem({
                name: item.name,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                isVegetarian: item.isVegetarian,
                category: item.category
              });
            }
            queryClient.invalidateQueries({ queryKey: ['nutrition-items'] });
          }
          
          if (importedData.goals) {
            await nutritionService.updateNutritionGoals(importedData.goals);
            queryClient.invalidateQueries({ queryKey: ['nutrition-goals'] });
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
    updateGoalsMutation.mutate(goals);
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

  const isLoading = itemsLoading || goalsLoading;
  
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
              {isLoading ? (
                <div className="glass-card p-6">Loading...</div>
              ) : (
                <NutritionTracker
                  nutritionItems={nutritionItems}
                  onAddItem={handleAddNutritionItem}
                  onDeleteItem={handleDeleteNutritionItem}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                />
              )}
            </div>
            
            <div>
              {showGoalsForm ? (
                <div className="glass-card p-6 mb-6">
                  <NutritionGoalsForm 
                    currentGoals={nutritionGoals || DEFAULT_NUTRITION_GOALS}
                    onSaveGoals={handleSaveGoals}
                    onCancel={() => setShowGoalsForm(false)}
                  />
                </div>
              ) : (
                <DailySummary 
                  nutritionTotals={nutritionTotals} 
                  nutritionGoals={nutritionGoals || DEFAULT_NUTRITION_GOALS}
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
