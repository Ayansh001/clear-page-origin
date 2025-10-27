
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Dumbbell, 
  Calendar, 
  ClipboardList, 
  ImageIcon, 
  ArrowUpRight,
  FlameIcon
} from 'lucide-react';
import { Workout, GymTask, ProgressImage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GymDashboardProps {
  workouts: Workout[];
  tasks: GymTask[];
  progressImages: ProgressImage[];
}

const GymDashboard = ({ workouts, tasks, progressImages }: GymDashboardProps) => {
  // Get today's workout if any
  const today = new Date();
  const todaysWorkout = workouts.find(
    w => format(new Date(w.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  
  // Calculate completion stats
  const completedSets = workouts.flatMap(w => 
    w.exercises.flatMap(e => e.sets.filter(s => s.completed))
  ).length;
  
  const totalSets = workouts.flatMap(w => 
    w.exercises.flatMap(e => e.sets)
  ).length;
  
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  
  // Sort workouts by date (most recent first)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const totalVolume = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{workouts.length}</div>
              <Dumbbell className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedWorkouts} completed, {workouts.length - completedWorkouts} planned
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Set Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completedSets}/{totalSets}</div>
            <Progress value={(completedSets / totalSets) * 100} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((completedSets / totalSets) * 100)}% sets completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{completedTasks}/{tasks.length}</div>
              <ClipboardList className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((completedTasks / tasks.length) * 100)}% tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalVolume.toLocaleString()}</div>
              <FlameIcon className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Kg lifted across all workouts
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Workouts</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="#workouts" className="flex items-center gap-1">
                  View all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentWorkouts.length > 0 ? (
                recentWorkouts.map(workout => (
                  <div key={workout.id} className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-md p-2">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workout.date), 'MMM d, yyyy')} • {workout.exercises.length} exercises
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {workout.exercises.slice(0, 3).map(exercise => (
                          <span key={exercise.id} className="bg-muted text-xs px-2 py-1 rounded-md">
                            {exercise.name}
                          </span>
                        ))}
                        {workout.exercises.length > 3 && (
                          <span className="bg-muted text-xs px-2 py-1 rounded-md">
                            +{workout.exercises.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        workout.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {workout.completed ? 'Completed' : 'Planned'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No workouts recorded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Plan</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {todaysWorkout ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{todaysWorkout.name}</h3>
                  {todaysWorkout.description && (
                    <p className="text-sm text-muted-foreground">{todaysWorkout.description}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {todaysWorkout.exercises.map(exercise => (
                    <div key={exercise.id} className="bg-muted rounded-lg p-3">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        {exercise.sets.map((set, idx) => (
                          <div 
                            key={set.id} 
                            className={`rounded border px-2 py-1 text-center ${
                              set.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                          >
                            {set.reps} × {set.weight}kg
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full">Start Workout</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground">No workout scheduled for today</p>
                <Button variant="outline" className="mt-4">Schedule Workout</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="#todos" className="flex items-center gap-1">
                  View all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className={`h-5 w-5 rounded-full ${
                    task.completed ? 'bg-primary' : 'border-2 border-muted-foreground'
                  }`}>
                    {task.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-white"
                      >
                        <polyline points="4 13 9 18 20 7"></polyline>
                      </svg>
                    )}
                  </div>
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progress Photos</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="#progress" className="flex items-center gap-1">
                  View all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {progressImages.length > 0 ? (
                progressImages.slice(0, 3).map(image => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={image.url} 
                      alt={`Progress on ${format(new Date(image.date), 'MMM d, yyyy')}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-white text-xs">
                        {format(new Date(image.date), 'MMM d')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center h-40">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground mt-2">No progress photos yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymDashboard;
