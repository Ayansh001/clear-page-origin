
import { Exercise } from '@/lib/types';
import ExerciseSetItem from './ExerciseSetItem';

interface ExerciseItemProps {
  exercise: Exercise;
  onToggleSet: (setId: string) => void;
}

const ExerciseItem = ({ exercise, onToggleSet }: ExerciseItemProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <h4 className="font-medium">{exercise.name}</h4>
      
      {exercise.notes && (
        <p className="text-sm text-muted-foreground mt-1">
          Note: {exercise.notes}
        </p>
      )}
      
      <div className="mt-3 grid grid-cols-4 gap-2">
        {exercise.sets.map((set, index) => (
          <ExerciseSetItem 
            key={set.id} 
            set={set} 
            index={index}
            onToggle={() => onToggleSet(set.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseItem;
