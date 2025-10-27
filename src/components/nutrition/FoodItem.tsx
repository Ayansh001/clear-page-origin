
import { format } from 'date-fns';
import { Leaf, Beef, Clock, Trash2 } from 'lucide-react';
import { NutritionItem, MealCategory } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FoodItemProps {
  item: NutritionItem;
  onDelete?: (id: string) => void;
}

const FoodItem = ({ item, onDelete }: FoodItemProps) => {
  const getCategoryColor = (category?: MealCategory) => {
    switch (category) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-green-100 text-green-800';
      case 'dinner': return 'bg-blue-100 text-blue-800';
      case 'snack': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category?: MealCategory) => {
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Other';
  };

  return (
    <div className="p-3 border border-border rounded-lg flex justify-between items-center animate-fade-in group">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h5 className="font-medium">{item.name}</h5>
          {item.isVegetarian ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Leaf size={14} className="text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Vegetarian</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Beef size={14} className="text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Non-Vegetarian</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {item.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
              {getCategoryLabel(item.category)}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span>{item.calories} kcal • {item.protein}g protein • {item.carbs}g carbs • {item.fats}g fats</span>
          <span className="flex items-center ml-2">
            <Clock size={12} className="mr-1" />
            {format(new Date(item.timestamp), 'MMM d, h:mm a')}
          </span>
        </div>
      </div>
      
      {onDelete && (
        <button 
          onClick={() => onDelete(item.id)}
          className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete food item"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default FoodItem;
