
import { useState } from 'react';
import { PlusIcon, Download, Upload } from 'lucide-react';
import { NutritionItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import NutritionSummary from './NutritionSummary';
import FoodList from './FoodList';
import AddFoodForm from './AddFoodForm';

interface NutritionTrackerProps {
  nutritionItems: NutritionItem[];
  onAddItem: (item: Omit<NutritionItem, 'id' | 'timestamp'>) => void;
  onDeleteItem: (id: string) => void;
  onExportData: () => void;
  onImportData: (fileInput: HTMLInputElement) => void;
  className?: string;
}

const NutritionTracker = ({
  nutritionItems,
  onAddItem,
  onDeleteItem,
  onExportData,
  onImportData,
  className
}: NutritionTrackerProps) => {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const fileInputRef = useState<HTMLInputElement | null>(null);
  
  const handleAddFood = (newFood: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    isVegetarian: boolean;
    category: any;
  }) => {
    onAddItem(newFood);
    setIsAddingFood(false);
  };
  
  const handleImportClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        onImportData(fileInput);
      }
    };
    fileInput.click();
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="section-heading">Nutrition Tracker</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportData}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Export nutrition data"
            >
              <Download size={14} className="mr-1" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button
              onClick={handleImportClick}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Import nutrition data"
            >
              <Upload size={14} className="mr-1" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <NutritionSummary nutritionItems={nutritionItems} />
        </div>
      </div>
      
      {/* Food Items List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Food Items</h4>
          <button
            onClick={() => setIsAddingFood(!isAddingFood)}
            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <PlusIcon size={16} />
          </button>
        </div>
        
        {isAddingFood ? (
          <AddFoodForm 
            onAddFood={handleAddFood}
            onCancel={() => setIsAddingFood(false)}
          />
        ) : null}
        
        <FoodList 
          nutritionItems={nutritionItems} 
          onAddFood={() => setIsAddingFood(true)} 
          onDeleteFood={onDeleteItem}
        />
      </div>
    </div>
  );
};

export default NutritionTracker;
