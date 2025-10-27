
import { useState } from 'react';
import { format } from 'date-fns';
import { Workout } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle, 
  Play, 
  Trash2, 
  Pencil, 
  Star,
  Calendar,
  Timer,
  DumbbellIcon
} from 'lucide-react';
import ExerciseItem from './ExerciseItem';
import { calculateWorkoutVolume } from '@/utils/workoutStats';

interface WorkoutCardProps {
  workout: Workout;
  onStartWorkout: (id: string) => void;
  onCompleteWorkout: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
  onEditWorkout: () => void;
  onToggleFavorite: () => void;
  onToggleExerciseSet: (exerciseId: string, setId: string) => void;
}

const WorkoutCard = ({ 
  workout, 
  onStartWorkout, 
  onCompleteWorkout, 
  onDeleteWorkout,
  onEditWorkout,
  onToggleFavorite,
  onToggleExerciseSet 
}: WorkoutCardProps) => {
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  
  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId) 
        : [...prev, exerciseId]
    );
  };
  
  // Calculate progress
  const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length, 
    0
  );
  const progressPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  
  // Calculate total volume
  const totalVolume = calculateWorkoutVolume(workout);
  
  return (
    <Card key={workout.id} className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={workout.favorite ? "text-yellow-500" : "text-muted-foreground"}
              onClick={onToggleFavorite}
            >
              <Star className="h-4 w-4" fill={workout.favorite ? "currentColor" : "none"} />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                {workout.name}
                {workout.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {workout.category && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {workout.category}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(workout.date), 'MMM d, yyyy')}
                </span>
                {workout.duration && (
                  <span className="flex items-center gap-1">
                    <Timer className="h-3.5 w-3.5" />
                    {workout.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onEditWorkout}
              className="h-8 w-8"
            >
              <Pencil size={16} />
            </Button>
            
            {!workout.startTime && !workout.completed && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600" 
                onClick={() => onStartWorkout(workout.id)}
              >
                <Play size={16} className="mr-1" /> Start
              </Button>
            )}
            
            {workout.startTime && !workout.completed && (
              <Button 
                size="sm" 
                className="bg-green-600" 
                onClick={() => onCompleteWorkout(workout.id)}
              >
                <CheckCircle size={16} className="mr-1" /> Complete
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDeleteWorkout(workout.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {workout.description && (
          <p className="text-sm mb-4">{workout.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Progress</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <div className="text-sm text-muted-foreground">{completedSets}/{totalSets} sets</div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <DumbbellIcon className="h-4 w-4 text-primary" />
              <span>Volume</span>
            </div>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()} kg</div>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="exercises">
            <AccordionTrigger className="text-base font-medium">
              Exercises ({workout.exercises.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-2">
                {workout.exercises.map(exercise => (
                  <ExerciseItem 
                    key={exercise.id} 
                    exercise={exercise} 
                    onToggleSet={(setId) => onToggleExerciseSet(exercise.id, setId)} 
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
