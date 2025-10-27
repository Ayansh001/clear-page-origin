
import { useState, useMemo } from 'react';
import { Workout, WorkoutTemplate } from '@/lib/types';
import { Plus, Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutForm from './workout/WorkoutForm';
import WorkoutCard from './workout/WorkoutCard';
import EmptyWorkoutState from './workout/EmptyWorkoutState';

interface WorkoutListProps {
  workouts: Workout[];
  templates: WorkoutTemplate[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
  onUpdateWorkout: (id: string, workout: Partial<Workout>) => void;
}

const WorkoutList = ({ 
  workouts, 
  templates,
  setWorkouts, 
  onAddWorkout,
  onUpdateWorkout
}: WorkoutListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [viewMode, setViewMode] = useState<string>('all');
  
  // Get unique categories from workouts
  const categories = useMemo(() => {
    const uniqueCategories = new Set(workouts.map(w => w.category || 'Uncategorized'));
    return ['all', ...Array.from(uniqueCategories)];
  }, [workouts]);
  
  // Filter and sort workouts
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      // Text search
      const matchesSearch = 
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (workout.description && workout.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = 
        filterCategory === 'all' || 
        (workout.category || 'Uncategorized') === filterCategory;
      
      // Status filter
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'completed' && workout.completed) ||
        (filterStatus === 'in-progress' && workout.startTime && !workout.completed) ||
        (filterStatus === 'planned' && !workout.startTime && !workout.completed);
      
      // Favorites filter
      const matchesFavorites = viewMode !== 'favorites' || !!workout.favorite;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesFavorites;
    }).sort((a, b) => {
      // Sort
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [workouts, searchQuery, filterCategory, filterStatus, sortBy, viewMode]);
  
  const handleStartWorkout = (workoutId: string) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, startTime: new Date() } 
          : workout
      )
    );
  };
  
  const handleCompleteWorkout = (workoutId: string) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { 
              ...workout, 
              endTime: new Date(),
              duration: workout.startTime 
                ? Math.round((new Date().getTime() - new Date(workout.startTime).getTime()) / 60000) 
                : undefined,
              completed: true 
            } 
          : workout
      )
    );
  };
  
  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
  };
  
  const handleToggleExerciseSet = (workoutId: string, exerciseId: string, setId: string) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? {
              ...workout,
              exercises: workout.exercises.map(exercise => 
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map(set => 
                        set.id === setId
                          ? { ...set, completed: !set.completed }
                          : set
                      )
                    }
                  : exercise
              )
            } 
          : workout
      )
    );
  };
  
  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateWorkout = (workout: Omit<Workout, 'id'>) => {
    if (editingWorkout) {
      onUpdateWorkout(editingWorkout.id, workout);
      setIsEditDialogOpen(false);
      setEditingWorkout(null);
    }
  };
  
  const handleToggleFavorite = (workoutId: string) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, favorite: !workout.favorite } 
          : workout
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Workouts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Add exercises, sets, and reps to create a new workout routine.
              </DialogDescription>
            </DialogHeader>
            
            <WorkoutForm 
              templates={templates}
              onAddWorkout={(workout) => {
                onAddWorkout(workout);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Editing dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
          </DialogHeader>
          
          {editingWorkout && (
            <WorkoutForm 
              existingWorkout={editingWorkout}
              onAddWorkout={handleUpdateWorkout}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingWorkout(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workouts..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="sm:hidden" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs 
            value={viewMode} 
            onValueChange={setViewMode}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Workouts</TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" /> Favorites
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="hidden sm:flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c !== 'all').map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id}
              workout={workout}
              onStartWorkout={handleStartWorkout}
              onCompleteWorkout={handleCompleteWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onEditWorkout={() => handleEditWorkout(workout)}
              onToggleFavorite={() => handleToggleFavorite(workout.id)}
              onToggleExerciseSet={(exerciseId, setId) => 
                handleToggleExerciseSet(workout.id, exerciseId, setId)
              }
            />
          ))
        ) : (
          workouts.length > 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No workouts match your search criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterStatus('all');
                setViewMode('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <EmptyWorkoutState onCreateWorkout={() => setIsDialogOpen(true)} />
          )
        )}
      </div>
    </div>
  );
};

export default WorkoutList;
