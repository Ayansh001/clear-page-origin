
import { ExerciseSet } from '@/lib/types';

interface ExerciseSetItemProps {
  set: ExerciseSet;
  index: number;
  onToggle: () => void;
}

const ExerciseSetItem = ({ set, index, onToggle }: ExerciseSetItemProps) => {
  return (
    <div 
      className={`border rounded-md px-3 py-2 text-center cursor-pointer transition-colors ${
        set.completed 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onToggle}
    >
      <div className="text-xs text-gray-500">Set {index + 1}</div>
      <div className="font-medium">{set.reps} × {set.weight}kg</div>
    </div>
  );
};

export default ExerciseSetItem;
