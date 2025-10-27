
import { Repeat } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RecurringWorkoutSelectorProps {
  recurring: boolean;
  recurringDays: number[];
  onToggleRecurring: (checked: boolean) => void;
  onToggleDay: (day: number) => void;
}

const RecurringWorkoutSelector = ({
  recurring,
  recurringDays,
  onToggleRecurring,
  onToggleDay
}: RecurringWorkoutSelectorProps) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="workout-recurring" 
          checked={recurring}
          onCheckedChange={onToggleRecurring}
        />
        <Label htmlFor="workout-recurring" className="flex items-center gap-2 cursor-pointer">
          <Repeat size={16} />
          Recurring Workout
        </Label>
      </div>
      
      {recurring && (
        <div className="mt-2 bg-muted/30 p-3 rounded-md">
          <Label className="text-sm mb-2 block">Repeat on days:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {weekDays.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => onToggleDay(index)}
                className={`px-3 py-1 text-xs rounded-full ${
                  recurringDays?.includes(index)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringWorkoutSelector;
