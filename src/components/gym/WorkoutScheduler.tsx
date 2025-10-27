
import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Workout } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkoutSchedulerProps {
  workouts: Workout[];
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
}

const WorkoutScheduler = ({ workouts, onAddWorkout }: WorkoutSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newWorkoutTime, setNewWorkoutTime] = useState('08:00');
  const [newWorkoutTemplate, setNewWorkoutTemplate] = useState('');
  
  // Generate days for weekly view
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  
  // Get workouts for the selected date
  const workoutsForSelectedDate = workouts.filter(workout => 
    isSameDay(new Date(workout.date), selectedDate)
  );
  
  // Previous and next week navigation
  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };
  
  // Create a simplified workout template for scheduling
  const handleScheduleWorkout = () => {
    if (!newWorkoutTemplate) return;
    
    // Find the template workout
    const templateWorkout = workouts.find(w => w.id === newWorkoutTemplate);
    if (!templateWorkout) return;
    
    // Create time components
    const [hours, minutes] = newWorkoutTime.split(':').map(Number);
    const scheduleDate = new Date(selectedDate);
    scheduleDate.setHours(hours, minutes, 0);
    
    // Create new workout based on template
    const newWorkout: Omit<Workout, 'id'> = {
      name: templateWorkout.name,
      description: templateWorkout.description,
      exercises: templateWorkout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false
        }))
      })),
      date: scheduleDate,
      completed: false
    };
    
    onAddWorkout(newWorkout);
    setIsAddingWorkout(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workout Schedule</h2>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
            <DialogTrigger asChild>
              <Button>Add Workout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Workout</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <CalendarIcon className="text-muted-foreground" />
                  <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workout-time">Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground" />
                    <Input 
                      id="workout-time" 
                      type="time" 
                      value={newWorkoutTime} 
                      onChange={e => setNewWorkoutTime(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workout-template">Workout Template</Label>
                  <Select value={newWorkoutTemplate} onValueChange={setNewWorkoutTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workout" />
                    </SelectTrigger>
                    <SelectContent>
                      {workouts.length > 0 ? (
                        workouts.map(workout => (
                          <SelectItem key={workout.id} value={workout.id}>
                            {workout.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No workouts available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingWorkout(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleScheduleWorkout}
                  disabled={!newWorkoutTemplate}
                >
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg overflow-hidden">
        <div className="bg-muted/50 py-3 px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
          </h3>
          <Button variant="ghost" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "py-3 cursor-pointer transition-colors hover:bg-muted/50", 
                isSameDay(day, selectedDate) ? "bg-primary/10 font-medium" : "",
                isSameDay(day, new Date()) ? "border-t-2 border-primary" : ""
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-sm text-muted-foreground">{format(day, 'EEE')}</div>
              <div className="text-xl">{format(day, 'd')}</div>
              
              {/* Workout indicators */}
              <div className="mt-2 flex justify-center gap-1">
                {workouts
                  .filter(workout => isSameDay(new Date(workout.date), day))
                  .slice(0, 3)
                  .map((workout, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 w-2 rounded-full ${workout.completed ? 'bg-green-500' : 'bg-primary'}`}
                    />
                  ))}
                
                {workouts.filter(workout => isSameDay(new Date(workout.date), day)).length > 3 && (
                  <div className="text-xs text-muted-foreground">+{workouts.filter(workout => 
                    isSameDay(new Date(workout.date), day)).length - 3}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">{format(selectedDate, 'EEEE, MMMM d')}</h3>
          <Button variant="outline" size="sm" onClick={() => setIsAddingWorkout(true)}>
            Add Workout
          </Button>
        </div>
        
        {workoutsForSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {workoutsForSelectedDate.map(workout => (
              <div 
                key={workout.id} 
                className={cn(
                  "p-4 rounded-lg border",
                  workout.completed ? "bg-green-50 border-green-200" : "bg-background"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{workout.name}</h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> 
                      {workout.startTime 
                        ? format(new Date(workout.startTime), 'h:mm a') 
                        : format(new Date(workout.date), 'h:mm a')
                      }
                      {workout.duration && ` (${workout.duration} mins)`}
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 text-xs rounded",
                    workout.completed 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  )}>
                    {workout.completed ? 'Completed' : 'Scheduled'}
                  </div>
                </div>
                
                {workout.description && (
                  <p className="text-sm mt-2">{workout.description}</p>
                )}
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {workout.exercises.slice(0, 3).map(exercise => (
                    <span key={exercise.id} className="text-xs bg-muted px-2 py-1 rounded">
                      {exercise.name}
                    </span>
                  ))}
                  {workout.exercises.length > 3 && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      +{workout.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No workouts scheduled for this day</p>
            <Button className="mt-4" onClick={() => setIsAddingWorkout(true)}>
              Schedule a Workout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutScheduler;
