
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MealCategory } from '@/lib/types';

interface CategorySelectProps {
  value: MealCategory;
  onChange: (value: MealCategory) => void;
}

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const categories: { value: MealCategory; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div>
      <label className="text-xs font-medium block mb-1">Meal Category</label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as MealCategory)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;
