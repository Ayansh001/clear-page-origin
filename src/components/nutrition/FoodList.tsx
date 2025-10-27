
import { useState } from 'react';
import { SaladIcon, Filter } from 'lucide-react';
import { NutritionItem, MealCategory } from '@/lib/types';
import FoodItem from './FoodItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FoodListProps {
  nutritionItems: NutritionItem[];
  onAddFood: () => void;
  onDeleteFood: (id: string) => void;
}

const FoodList = ({ nutritionItems, onAddFood, onDeleteFood }: FoodListProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  
  const getCategoryFilteredItems = () => {
    if (categoryFilter === 'all') return nutritionItems;
    return nutritionItems.filter(item => item.category === categoryFilter);
  };
  
  const getDateFilteredItems = (items: NutritionItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - today.getDay());
    
    switch (dateFilter) {
      case 'today':
        return items.filter(item => new Date(item.timestamp) >= today);
      case 'yesterday':
        return items.filter(
          item => new Date(item.timestamp) >= yesterday && new Date(item.timestamp) < today
        );
      case 'thisWeek':
        return items.filter(item => new Date(item.timestamp) >= thisWeekStart);
      default:
        return items;
    }
  };
  
  const filteredItems = getDateFilteredItems(getCategoryFilteredItems());

  if (nutritionItems.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <SaladIcon className="text-muted-foreground" size={20} />
        </div>
        <p className="text-muted-foreground">No food items added yet</p>
        <button
          onClick={onAddFood}
          className="mt-2 text-primary text-sm hover:underline"
        >
          Add your first food item
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Time Range</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No items match your filters</p>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setDateFilter('all');
            }}
            className="mt-1 text-primary text-sm hover:underline flex items-center justify-center mx-auto"
          >
            <Filter size={14} className="mr-1" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <FoodItem 
              key={item.id} 
              item={item} 
              onDelete={onDeleteFood}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;
