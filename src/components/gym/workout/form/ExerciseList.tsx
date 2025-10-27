
import { Exercise } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ExerciseListProps {
  exercises: Exercise[];
  onRemoveExercise: (index: number) => void;
}

const ExerciseList = ({ exercises, onRemoveExercise }: ExerciseListProps) => {
  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, exIndex) => (
        <div key={exercise.id} className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{exercise.name}</h4>
              {exercise.difficulty && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {exercise.difficulty}
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveExercise(exIndex)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
          
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>Set</div>
              <div>Reps</div>
              <div>Weight (kg)</div>
            </div>
            
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} className="grid grid-cols-3 gap-2 text-sm">
                <div>{setIndex + 1}</div>
                <div>{set.reps}</div>
                <div>{set.weight}</div>
              </div>
            ))}
          </div>
          
          {exercise.notes && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Notes:</span> {exercise.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
