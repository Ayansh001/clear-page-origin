
import { useState, useEffect } from 'react';
import { Exercise, ExerciseSet, ExerciseDifficulty } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Info, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
import { getExerciseInfo, getExerciseSuggestions } from '@/services/nutritionService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ExerciseFormProps {
  onAddExercise: (exercise: Omit<Exercise, 'id'>) => void;
}

const ExerciseForm = ({ onAddExercise }: ExerciseFormProps) => {
  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'>>({
    name: '',
    sets: [{
      id: `temp-${Date.now()}-${Math.random()}`,
      reps: 10,
      weight: 20,
      completed: false
    }],
    notes: '',
    difficulty: 'intermediate'
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exerciseInfo, setExerciseInfo] = useState<any>(null);

  // Get exercise suggestions on component mount
  useEffect(() => {
    setSuggestions(getExerciseSuggestions());
  }, []);

  const handleExerciseNameChange = (name: string) => {
    setNewExercise(prev => ({ ...prev, name }));
    
    // Check if we have info for this exercise
    const info = getExerciseInfo(name);
    if (info) {
      setExerciseInfo(info);
      setNewExercise(prev => ({
        ...prev,
        name: info.name,
        notes: prev.notes || `${info.muscleGroup} exercise. ${info.difficulty} difficulty.`,
        difficulty: info.difficulty?.toLowerCase() as ExerciseDifficulty || 'intermediate'
      }));
    } else {
      setExerciseInfo(null);
    }
  };

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(exercise => 
    exercise.toLowerCase().includes(newExercise.name.toLowerCase())
  ).slice(0, 5); // Limit to 5 suggestions

  const handleAddSet = () => {
    setNewExercise(prev => ({
      ...prev,
      sets: [
        ...prev.sets,
        { 
          id: `temp-${Date.now()}-${Math.random()}`,
          reps: prev.sets[prev.sets.length - 1].reps, 
          weight: prev.sets[prev.sets.length - 1].weight, 
          completed: false
        }
      ]
    }));
  };
  
  const handleRemoveSet = (index: number) => {
    if (newExercise.sets.length <= 1) return;
    
    setNewExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const handleAddExercise = () => {
    if (newExercise.name.trim() === '') return;
    
    onAddExercise(newExercise);
    
    // Reset for next exercise
    setNewExercise({
      name: '',
      sets: [{
        id: `temp-${Date.now()}-${Math.random()}`,
        reps: 10,
        weight: 20,
        completed: false
      }],
      notes: '',
      difficulty: 'intermediate'
    });
    setExerciseInfo(null);
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h4 className="font-medium mb-4">Add Exercise</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exercise-name">Exercise Name</Label>
          <div className="relative">
            <Input 
              id="exercise-name" 
              value={newExercise.name} 
              onChange={e => handleExerciseNameChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g., Bench Press or search our database" 
            />
            
            {/* Exercise suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => handleExerciseNameChange(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Exercise Info */}
        {exerciseInfo && (
          <div className="bg-primary/10 p-3 rounded-md text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{exerciseInfo.name}</div>
              <div className="text-xs px-2 py-1 bg-primary/20 rounded-full">{exerciseInfo.difficulty}</div>
            </div>
            <div className="mt-2">{exerciseInfo.instructions}</div>
            <div className="mt-1 text-xs text-muted-foreground">Muscle group: {exerciseInfo.muscleGroup}</div>
          </div>
        )}
        
        {/* Difficulty Level */}
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup 
            value={newExercise.difficulty || 'intermediate'} 
            onValueChange={(value) => setNewExercise(prev => ({ 
              ...prev, 
              difficulty: value as ExerciseDifficulty 
            }))}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="flex items-center cursor-pointer">
                <SignalLow size={16} className="text-green-500 mr-1" /> Beginner
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="flex items-center cursor-pointer">
                <SignalMedium size={16} className="text-yellow-500 mr-1" /> Intermediate
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="flex items-center cursor-pointer">
                <SignalHigh size={16} className="text-red-500 mr-1" /> Advanced
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sets</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddSet}
            >
              Add Set
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>Set</div>
              <div>Reps</div>
              <div>Weight (kg)</div>
            </div>
            
            {newExercise.sets.map((set, index) => (
              <div key={set.id} className="grid grid-cols-3 gap-2 items-center">
                <div className="flex items-center">
                  <span className="mr-2">{index + 1}</span>
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemoveSet(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <Input 
                  type="number" 
                  value={set.reps} 
                  onChange={e => {
                    const value = parseInt(e.target.value) || 0;
                    setNewExercise(prev => ({
                      ...prev,
                      sets: prev.sets.map((s, i) => 
                        i === index ? { ...s, reps: value } : s
                      )
                    }));
                  }}
                  min="1"
                  className="h-8"
                />
                <Input 
                  type="number" 
                  value={set.weight} 
                  onChange={e => {
                    const value = parseFloat(e.target.value) || 0;
                    setNewExercise(prev => ({
                      ...prev,
                      sets: prev.sets.map((s, i) => 
                        i === index ? { ...s, weight: value } : s
                      )
                    }));
                  }}
                  min="0"
                  step="2.5"
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="exercise-notes">Notes (Optional)</Label>
          <Textarea 
            id="exercise-notes" 
            value={newExercise.notes} 
            onChange={e => setNewExercise(prev => ({ ...prev, notes: e.target.value }))} 
            placeholder="e.g., Keep elbows tucked"
            className="h-20"
          />
        </div>
        
        <Button 
          type="button" 
          onClick={handleAddExercise} 
          className="w-full"
          disabled={!newExercise.name}
        >
          Add Exercise to Workout
        </Button>
      </div>
    </div>
  );
};

export default ExerciseForm;
