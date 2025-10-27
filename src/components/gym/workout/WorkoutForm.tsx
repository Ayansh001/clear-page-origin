
import { useState, useEffect } from 'react';
import { Workout, Exercise, WorkoutTemplate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from './form/FormSection';
import RecurringWorkoutSelector from './form/RecurringWorkoutSelector';
import ExerciseList from './form/ExerciseList';
import ExerciseForm from './ExerciseForm';

interface WorkoutFormProps {
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
  onCancel: () => void;
  existingWorkout?: Workout;
  isTemplate?: boolean;
  templates?: WorkoutTemplate[];
}

// Common workout categories
const WORKOUT_CATEGORIES = [
  'Upper Body',
  'Lower Body',
  'Full Body',
  'Push',
  'Pull',
  'Legs',
  'Core',
  'Cardio',
  'HIIT',
  'Strength',
  'Flexibility',
  'Other'
];

const WorkoutForm = ({ 
  onAddWorkout, 
  onCancel, 
  existingWorkout, 
  isTemplate = false,
  templates = []
}: WorkoutFormProps) => {
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id'>>({
    name: '',
    description: '',
    exercises: [],
    completed: false,
    date: new Date(),
    recurring: false,
    recurringDays: [],
    category: '',
    favorite: false
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Initialize form with existing workout if provided
  useEffect(() => {
    if (existingWorkout) {
      setNewWorkout({
        ...existingWorkout
      });
    }
  }, [existingWorkout]);
  
  // Apply template when selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setNewWorkout(prev => ({
          ...prev,
          name: template.name,
          description: template.description || '',
          exercises: [...template.exercises],
          category: template.category || '',
          templateId: template.id
        }));
      }
    }
  }, [selectedTemplate, templates]);

  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    const exerciseWithTempId = {
      ...exercise,
      id: `temp-${Date.now()}`,
      sets: exercise.sets.map(set => ({
        ...set,
        id: `temp-${Date.now()}-${Math.random()}`
      }))
    } as Exercise;
    
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseWithTempId]
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout(prev => ({
      ...prev, 
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleToggleRecurring = (checked: boolean) => {
    setNewWorkout(prev => ({
      ...prev,
      recurring: checked,
      recurringDays: checked ? [1, 3, 5] : [] // Default to Mon, Wed, Fri
    }));
  };

  const handleToggleDay = (day: number) => {
    setNewWorkout(prev => {
      const currentDays = prev.recurringDays || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      return {
        ...prev,
        recurringDays: newDays
      };
    });
  };

  const handleSubmit = () => {
    if (newWorkout.name.trim() === '' || newWorkout.exercises.length === 0) return;
    onAddWorkout(newWorkout);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4">
        {templates.length > 0 && !existingWorkout && !isTemplate && (
          <FormSection title="Use Template (Optional)">
            <Select 
              value={selectedTemplate} 
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormSection>
        )}
        
        <FormSection title="Workout Name">
          <Input 
            id="workout-name" 
            value={newWorkout.name} 
            onChange={e => setNewWorkout(prev => ({ ...prev, name: e.target.value }))} 
            placeholder="e.g., Upper Body Strength" 
          />
        </FormSection>
        
        <FormSection title="Description (Optional)">
          <Textarea 
            id="workout-description" 
            value={newWorkout.description} 
            onChange={e => setNewWorkout(prev => ({ ...prev, description: e.target.value }))} 
            placeholder="e.g., Focus on chest and shoulders"
          />
        </FormSection>
        
        <FormSection title="Category">
          <Select 
            value={newWorkout.category} 
            onValueChange={(value) => setNewWorkout(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {WORKOUT_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormSection>
        
        {!isTemplate && (
          <RecurringWorkoutSelector 
            recurring={newWorkout.recurring}
            recurringDays={newWorkout.recurringDays || []}
            onToggleRecurring={handleToggleRecurring}
            onToggleDay={handleToggleDay}
          />
        )}
        
        <FormSection title="Favorite">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="favorite" 
              checked={newWorkout.favorite} 
              onCheckedChange={(checked) => 
                setNewWorkout(prev => ({ ...prev, favorite: !!checked }))
              }
            />
            <Label htmlFor="favorite">Mark as favorite</Label>
          </div>
        </FormSection>
        
        <FormSection title="Exercises">
          <ExerciseList 
            exercises={newWorkout.exercises} 
            onRemoveExercise={handleRemoveExercise} 
          />
          
          <ExerciseForm onAddExercise={handleAddExercise} />
        </FormSection>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={newWorkout.name === '' || newWorkout.exercises.length === 0}
        >
          {existingWorkout ? 'Update' : isTemplate ? 'Create Template' : 'Create Workout'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default WorkoutForm;
