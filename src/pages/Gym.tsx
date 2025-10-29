import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import GymTabs from '@/components/gym/GymTabs';
import { Workout, GymTask, ProgressImage, WorkoutTemplate, WorkoutStatistics } from '@/lib/types';
import { workoutService } from '@/services/workoutService';
import { calculateWorkoutStatistics, calculateWorkoutVolume } from '@/utils/workoutStats';
import { useToast } from '@/hooks/use-toast';

const Gym = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all data from Supabase
  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => workoutService.getWorkouts()
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => workoutService.getTemplates()
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => workoutService.getTasks()
  });

  const { data: progressImages = [] } = useQuery({
    queryKey: ['progress-images'],
    queryFn: () => workoutService.getProgressImages()
  });

  // Calculate statistics from workouts
  const statistics = calculateWorkoutStatistics(workouts);
  
  // Mutations
  const addWorkoutMutation = useMutation({
    mutationFn: (workout: Omit<Workout, 'id'>) => {
      const volumeTotal = calculateWorkoutVolume(workout as Workout);
      return workoutService.addWorkout({ ...workout, volumeTotal });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Workout Created",
        description: `"${data.name}" has been added to your workouts.`,
      });
    }
  });

  const updateWorkoutMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Workout> }) => {
      const volumeTotal = updates.exercises ? calculateWorkoutVolume({ exercises: updates.exercises } as Workout) : undefined;
      return workoutService.updateWorkout(id, { ...updates, volumeTotal });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast({
        title: "Workout Updated",
        description: "Your workout has been updated successfully.",
      });
    }
  });

  const addTemplateMutation = useMutation({
    mutationFn: (template: Omit<WorkoutTemplate, 'id'>) =>
      workoutService.addTemplate(template),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Created",
        description: `"${data.name}" template has been created.`,
      });
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WorkoutTemplate> }) =>
      workoutService.updateTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Updated",
        description: "Your template has been updated successfully.",
      });
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => workoutService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: "Template Deleted",
        description: "Your template has been deleted.",
      });
    }
  });

  const addTaskMutation = useMutation({
    mutationFn: (task: Omit<GymTask, 'id'>) => workoutService.addTask(task),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Added",
        description: `"${data.title}" has been added to your tasks.`,
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<GymTask> }) =>
      workoutService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const addProgressImageMutation = useMutation({
    mutationFn: (image: Omit<ProgressImage, 'id'>) =>
      workoutService.addProgressImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress-images'] });
      toast({
        title: "Image Added",
        description: "Your progress image has been added to the gallery.",
      });
    }
  });

  // Handler functions
  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    addWorkoutMutation.mutate(workout);
  };
  
  const updateWorkout = (id: string, updatedFields: Partial<Workout>) => {
    updateWorkoutMutation.mutate({ id, updates: updatedFields });
  };
  
  const addTemplate = (template: Omit<WorkoutTemplate, 'id'>) => {
    addTemplateMutation.mutate(template);
  };
  
  const updateTemplate = (id: string, updatedFields: Partial<WorkoutTemplate>) => {
    updateTemplateMutation.mutate({ id, updates: updatedFields });
  };
  
  const deleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };
  
  const duplicateTemplate = (id: string) => {
    const templateToDuplicate = templates.find(t => t.id === id);
    if (!templateToDuplicate) return;
    
    const newTemplate = {
      ...templateToDuplicate,
      name: `${templateToDuplicate.name} (Copy)`,
    };
    
    // Remove id from the template before adding
    const { id: _, ...templateWithoutId } = newTemplate;
    addTemplate(templateWithoutId);
    
    toast({
      title: "Template Duplicated",
      description: `"${newTemplate.name}" has been created.`,
    });
  };
  
  const createWorkoutFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    const newWorkout: Omit<Workout, 'id'> = {
      name: template.name,
      description: template.description,
      exercises: [...template.exercises],
      completed: false,
      date: new Date(),
      category: template.category,
      templateId: template.id,
      favorite: template.favorite
    };
    
    addWorkout(newWorkout);
    
    toast({
      title: "Workout Created from Template",
      description: `"${template.name}" workout has been created.`,
    });
  };

  const addTask = (task: Omit<GymTask, 'id'>) => {
    addTaskMutation.mutate(task);
  };

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTaskMutation.mutate({ id, updates: { completed: !task.completed } });
    }
  };

  const addProgressImage = (image: Omit<ProgressImage, 'id'>) => {
    addProgressImageMutation.mutate(image);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-24 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Gym & Fitness Tracker</h1>
            <p className="text-muted-foreground mt-2">Track your workouts, schedule sessions, and monitor your progress</p>
          </div>

          {workoutsLoading ? (
            <div className="glass-card p-6">Loading...</div>
          ) : (
            <GymTabs
              workouts={workouts}
              tasks={tasks}
              progressImages={progressImages}
              templates={templates}
              statistics={statistics}
              setWorkouts={() => {}}
              onAddWorkout={addWorkout}
              onUpdateWorkout={updateWorkout}
              onAddTemplate={addTemplate}
              onUpdateTemplate={updateTemplate}
              onDeleteTemplate={deleteTemplate}
              onDuplicateTemplate={duplicateTemplate}
              onCreateWorkoutFromTemplate={createWorkoutFromTemplate}
              onAddTask={addTask}
              onToggleTask={toggleTaskCompletion}
              onAddProgressImage={addProgressImage}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Gym;
