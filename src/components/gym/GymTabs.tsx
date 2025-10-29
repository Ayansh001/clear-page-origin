
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GymDashboard from '@/components/gym/GymDashboard';
import WorkoutList from '@/components/gym/WorkoutList';
import WorkoutScheduler from '@/components/gym/WorkoutScheduler';
import TodoList from '@/components/gym/TodoList';
import ProgressGallery from '@/components/gym/ProgressGallery';
import { Workout, GymTask, ProgressImage } from '@/lib/types';

interface GymTabsProps {
  workouts: Workout[];
  tasks: GymTask[];
  progressImages: ProgressImage[];
  templates: any[];
  statistics: any;
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
  onUpdateWorkout: (id: string, workout: Partial<Workout>) => void;
  onAddTemplate: (template: any) => void;
  onUpdateTemplate: (id: string, template: any) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate: (id: string) => void;
  onCreateWorkoutFromTemplate: (templateId: string) => void;
  onAddTask: (task: Omit<GymTask, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onAddProgressImage: (image: Omit<ProgressImage, 'id'>) => void;
}

const GymTabs = ({
  workouts,
  tasks,
  progressImages,
  templates,
  setWorkouts,
  onAddWorkout,
  onUpdateWorkout,
  onAddTask,
  onToggleTask,
  onAddProgressImage
}: GymTabsProps) => {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="workouts">Workouts</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="todos">To-Do List</TabsTrigger>
        <TabsTrigger value="progress">Progress Photos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="mt-4">
        <GymDashboard 
          workouts={workouts} 
          tasks={tasks} 
          progressImages={progressImages} 
        />
      </TabsContent>
      
      <TabsContent value="workouts" className="mt-4">
        <WorkoutList 
          workouts={workouts}
          templates={templates}
          setWorkouts={setWorkouts} 
          onAddWorkout={onAddWorkout}
          onUpdateWorkout={onUpdateWorkout}
        />
      </TabsContent>
      
      <TabsContent value="schedule" className="mt-4">
        <WorkoutScheduler 
          workouts={workouts} 
          onAddWorkout={onAddWorkout} 
        />
      </TabsContent>
      
      <TabsContent value="todos" className="mt-4">
        <TodoList 
          tasks={tasks} 
          onAddTask={onAddTask} 
          onToggleTask={onToggleTask} 
        />
      </TabsContent>
      
      <TabsContent value="progress" className="mt-4">
        <ProgressGallery 
          images={progressImages} 
          onAddImage={onAddProgressImage} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default GymTabs;
