
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GymTabs from '@/components/gym/GymTabs';
import { Workout, GymTask, ProgressImage, WorkoutTemplate, WorkoutStatistics } from '@/lib/types';
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/lib/localStorage';
import { calculateWorkoutStatistics, calculateWorkoutVolume } from '@/utils/workoutStats';
import { useToast } from '@/hooks/use-toast';

const Gym = () => {
  const { toast } = useToast();
  
  // Load data from localStorage
  const [workouts, setWorkouts] = useState<Workout[]>(() => 
    loadFromLocalStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, [])
  );
  
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => 
    loadFromLocalStorage<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES, [])
  );
  
  const [tasks, setTasks] = useState<GymTask[]>(() => 
    loadFromLocalStorage<GymTask[]>(STORAGE_KEYS.GYM_TASKS, [])
  );
  
  const [progressImages, setProgressImages] = useState<ProgressImage[]>(() => 
    loadFromLocalStorage<ProgressImage[]>(STORAGE_KEYS.PROGRESS_IMAGES, [])
  );
  
  const [statistics, setStatistics] = useState<WorkoutStatistics>(() => 
    loadFromLocalStorage<WorkoutStatistics>(
      STORAGE_KEYS.WORKOUT_STATISTICS, 
      calculateWorkoutStatistics([])
    )
  );
  
  // Save data to localStorage when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WORKOUTS, workouts);
  }, [workouts]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);
  }, [templates]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.GYM_TASKS, tasks);
  }, [tasks]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.PROGRESS_IMAGES, progressImages);
  }, [progressImages]);
  
  // Update statistics when workouts change
  useEffect(() => {
    const newStats = calculateWorkoutStatistics(workouts);
    setStatistics(newStats);
    saveToLocalStorage(STORAGE_KEYS.WORKOUT_STATISTICS, newStats);
  }, [workouts]);
  
  // Initialize with some sample data if none exists
  useEffect(() => {
    const hasInitializedKey = 'gym_data_initialized';
    const hasInitialized = localStorage.getItem(hasInitializedKey);
    
    if (!hasInitialized && workouts.length === 0 && templates.length === 0) {
      // Sample workouts
      const sampleWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Upper Body Strength',
          description: 'Focus on chest, shoulders, and triceps',
          category: 'Upper Body',
          exercises: [
            {
              id: '1-1',
              name: 'Bench Press',
              sets: [
                { id: '1-1-1', reps: 10, weight: 60, completed: true },
                { id: '1-1-2', reps: 8, weight: 70, completed: true },
                { id: '1-1-3', reps: 6, weight: 80, completed: false },
              ],
              notes: 'Focus on form, keep elbows tucked',
              targetMuscles: ['Chest', 'Triceps', 'Shoulders']
            },
            {
              id: '1-2',
              name: 'Shoulder Press',
              sets: [
                { id: '1-2-1', reps: 10, weight: 40, completed: true },
                { id: '1-2-2', reps: 10, weight: 40, completed: false },
                { id: '1-2-3', reps: 10, weight: 40, completed: false },
              ],
              targetMuscles: ['Shoulders', 'Triceps']
            }
          ],
          startTime: new Date(2023, 6, 15, 9, 0),
          endTime: new Date(2023, 6, 15, 10, 15),
          duration: 75,
          completed: false,
          date: new Date(2023, 6, 15),
          favorite: true,
          volumeTotal: 1540
        },
        {
          id: '2',
          name: 'Leg Day',
          description: 'Squats and deadlifts focus',
          category: 'Lower Body',
          exercises: [
            {
              id: '2-1',
              name: 'Squats',
              sets: [
                { id: '2-1-1', reps: 12, weight: 80, completed: true },
                { id: '2-1-2', reps: 10, weight: 90, completed: true },
                { id: '2-1-3', reps: 8, weight: 100, completed: true },
              ],
              targetMuscles: ['Quads', 'Glutes', 'Hamstrings']
            },
            {
              id: '2-2',
              name: 'Deadlifts',
              sets: [
                { id: '2-2-1', reps: 10, weight: 100, completed: true },
                { id: '2-2-2', reps: 8, weight: 110, completed: true },
                { id: '2-2-3', reps: 6, weight: 120, completed: true },
              ],
              notes: 'Keep back straight, push through heels',
              targetMuscles: ['Lower Back', 'Glutes', 'Hamstrings']
            }
          ],
          startTime: new Date(2023, 6, 12, 16, 30),
          endTime: new Date(2023, 6, 12, 18, 0),
          duration: 90,
          completed: true,
          date: new Date(2023, 6, 12),
          volumeTotal: 3440
        }
      ];
      
      // Sample templates
      const sampleTemplates: WorkoutTemplate[] = [
        {
          id: 'template-1',
          name: 'Push Day',
          category: 'Upper Body',
          description: 'Chest, shoulders, and triceps focus',
          exercises: [
            {
              id: 't1-1',
              name: 'Bench Press',
              sets: [
                { id: 't1-1-1', reps: 10, weight: 60, completed: false },
                { id: 't1-1-2', reps: 8, weight: 70, completed: false },
                { id: 't1-1-3', reps: 6, weight: 80, completed: false },
              ],
              targetMuscles: ['Chest', 'Triceps', 'Shoulders']
            },
            {
              id: 't1-2',
              name: 'Shoulder Press',
              sets: [
                { id: 't1-2-1', reps: 10, weight: 40, completed: false },
                { id: 't1-2-2', reps: 8, weight: 45, completed: false },
                { id: 't1-2-3', reps: 6, weight: 50, completed: false },
              ],
              targetMuscles: ['Shoulders', 'Triceps']
            },
            {
              id: 't1-3',
              name: 'Triceps Pushdown',
              sets: [
                { id: 't1-3-1', reps: 12, weight: 30, completed: false },
                { id: 't1-3-2', reps: 12, weight: 30, completed: false },
                { id: 't1-3-3', reps: 12, weight: 30, completed: false },
              ],
              targetMuscles: ['Triceps']
            }
          ],
          favorite: true
        },
        {
          id: 'template-2',
          name: 'Pull Day',
          category: 'Upper Body',
          description: 'Back and biceps focus',
          exercises: [
            {
              id: 't2-1',
              name: 'Pull-ups',
              sets: [
                { id: 't2-1-1', reps: 8, weight: 0, completed: false },
                { id: 't2-1-2', reps: 8, weight: 0, completed: false },
                { id: 't2-1-3', reps: 8, weight: 0, completed: false },
              ],
              targetMuscles: ['Back', 'Biceps']
            },
            {
              id: 't2-2',
              name: 'Bent Over Rows',
              sets: [
                { id: 't2-2-1', reps: 10, weight: 60, completed: false },
                { id: 't2-2-2', reps: 10, weight: 60, completed: false },
                { id: 't2-2-3', reps: 10, weight: 60, completed: false },
              ],
              targetMuscles: ['Back', 'Biceps']
            },
            {
              id: 't2-3',
              name: 'Bicep Curls',
              sets: [
                { id: 't2-3-1', reps: 12, weight: 20, completed: false },
                { id: 't2-3-2', reps: 12, weight: 20, completed: false },
                { id: 't2-3-3', reps: 12, weight: 20, completed: false },
              ],
              targetMuscles: ['Biceps']
            }
          ]
        }
      ];
      
      // Sample tasks
      const sampleTasks: GymTask[] = [
        { id: '1', title: 'Buy new workout gloves', completed: false, date: new Date() },
        { id: '2', title: 'Schedule session with trainer', completed: true, date: new Date() },
        { id: '3', title: 'Prepare post-workout meal', completed: false, date: new Date() }
      ];
      
      // Sample progress images
      const sampleImages: ProgressImage[] = [
        { 
          id: '1', 
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&h=400&fit=crop', 
          date: new Date(2023, 5, 1),
          notes: 'Week 1 of new program'
        },
        { 
          id: '2', 
          url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&h=400&fit=crop', 
          date: new Date(2023, 6, 1),
          notes: 'One month progress'
        }
      ];
      
      // Set the sample data
      setWorkouts(sampleWorkouts);
      setTemplates(sampleTemplates);
      setTasks(sampleTasks);
      setProgressImages(sampleImages);
      
      // Update statistics
      const newStats = calculateWorkoutStatistics(sampleWorkouts);
      setStatistics(newStats);
      saveToLocalStorage(STORAGE_KEYS.WORKOUT_STATISTICS, newStats);
      
      // Mark as initialized
      localStorage.setItem(hasInitializedKey, 'true');
    }
  }, [workouts.length, templates.length]);

  // Add workout
  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    // Calculate volume total
    const volumeTotal = workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
    
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substring(2, 9),
      volumeTotal
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    
    toast({
      title: "Workout Created",
      description: `"${newWorkout.name}" has been added to your workouts.`,
    });
  };
  
  // Update workout
  const updateWorkout = (id: string, updatedFields: Partial<Workout>) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id 
          ? { 
              ...workout, 
              ...updatedFields,
              volumeTotal: calculateWorkoutVolume({
                ...workout,
                ...updatedFields,
                exercises: updatedFields.exercises || workout.exercises
              })
            } 
          : workout
      )
    );
    
    toast({
      title: "Workout Updated",
      description: "Your workout has been updated successfully.",
    });
  };
  
  // Add template
  const addTemplate = (template: Omit<WorkoutTemplate, 'id'>) => {
    const newTemplate = {
      ...template,
      id: `template-${Math.random().toString(36).substring(2, 9)}`
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Created",
      description: `"${newTemplate.name}" template has been created.`,
    });
  };
  
  // Update template
  const updateTemplate = (id: string, updatedFields: Partial<WorkoutTemplate>) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, ...updatedFields } 
          : template
      )
    );
    
    toast({
      title: "Template Updated",
      description: "Your template has been updated successfully.",
    });
  };
  
  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    
    toast({
      title: "Template Deleted",
      description: "Your template has been deleted.",
    });
  };
  
  // Duplicate template
  const duplicateTemplate = (id: string) => {
    const templateToDuplicate = templates.find(t => t.id === id);
    if (!templateToDuplicate) return;
    
    const newTemplate = {
      ...templateToDuplicate,
      id: `template-${Math.random().toString(36).substring(2, 9)}`,
      name: `${templateToDuplicate.name} (Copy)`,
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    
    toast({
      title: "Template Duplicated",
      description: `"${newTemplate.name}" has been created.`,
    });
  };
  
  // Create workout from template
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

  // Add task
  const addTask = (task: Omit<GymTask, 'id'>) => {
    const newTask = {
      ...task,
      id: Math.random().toString(36).substring(2, 9)
    };
    setTasks(prev => [...prev, newTask]);
    
    toast({
      title: "Task Added",
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add progress image
  const addProgressImage = (image: Omit<ProgressImage, 'id'>) => {
    const newImage = {
      ...image,
      id: Math.random().toString(36).substring(2, 9)
    };
    setProgressImages(prev => [...prev, newImage]);
    
    toast({
      title: "Image Added",
      description: "Your progress image has been added to the gallery.",
    });
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

          <GymTabs
            workouts={workouts}
            tasks={tasks}
            progressImages={progressImages}
            templates={templates}
            statistics={statistics}
            setWorkouts={setWorkouts}
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
        </div>
      </main>
    </div>
  );
};

export default Gym;
