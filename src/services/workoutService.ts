import { supabase } from "@/integrations/supabase/client";
import { Workout, WorkoutTemplate, GymTask, ProgressImage } from "@/lib/types";

export const workoutService = {
  // Workouts
  async getWorkouts(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .is('user_id', null)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(w => ({
      id: w.id,
      name: w.name,
      description: w.description || undefined,
      exercises: w.exercises as any,
      startTime: w.start_time ? new Date(w.start_time) : undefined,
      endTime: w.end_time ? new Date(w.end_time) : undefined,
      duration: w.duration || undefined,
      completed: w.completed,
      date: new Date(w.date),
      recurring: w.recurring || false,
      recurringDays: w.recurring_days || [],
      templateId: w.template_id || undefined,
      category: w.category || undefined,
      favorite: w.favorite || false,
      volumeTotal: w.volume_total || undefined
    }));
  },

  async addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .insert([{
        name: workout.name,
        description: workout.description,
        exercises: workout.exercises as any,
        start_time: workout.startTime?.toISOString(),
        end_time: workout.endTime?.toISOString(),
        duration: workout.duration,
        completed: workout.completed,
        date: new Date(workout.date).toISOString().split('T')[0],
        recurring: workout.recurring,
        recurring_days: workout.recurringDays,
        template_id: workout.templateId,
        category: workout.category,
        favorite: workout.favorite,
        volume_total: workout.volumeTotal
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      exercises: data.exercises as any,
      startTime: data.start_time ? new Date(data.start_time) : undefined,
      endTime: data.end_time ? new Date(data.end_time) : undefined,
      duration: data.duration || undefined,
      completed: data.completed,
      date: new Date(data.date),
      recurring: data.recurring || false,
      recurringDays: data.recurring_days || [],
      templateId: data.template_id || undefined,
      category: data.category || undefined,
      favorite: data.favorite || false,
      volumeTotal: data.volume_total || undefined
    };
  },

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<void> {
    const updateData: Record<string, any> = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.exercises) updateData.exercises = updates.exercises as any;
    if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
    if (updates.endTime) updateData.end_time = updates.endTime.toISOString();
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.date) updateData.date = new Date(updates.date).toISOString().split('T')[0];
    if (updates.recurring !== undefined) updateData.recurring = updates.recurring;
    if (updates.recurringDays) updateData.recurring_days = updates.recurringDays;
    if (updates.templateId !== undefined) updateData.template_id = updates.templateId;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.favorite !== undefined) updateData.favorite = updates.favorite;
    if (updates.volumeTotal !== undefined) updateData.volume_total = updates.volumeTotal;
    
    const { error } = await supabase
      .from('workouts')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  },

  // Templates
  async getTemplates(): Promise<WorkoutTemplate[]> {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .is('user_id', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(t => ({
      id: t.id,
      name: t.name,
      description: t.description || undefined,
      exercises: t.exercises as any,
      category: t.category || undefined,
      favorite: t.favorite || false
    }));
  },

  async addTemplate(template: Omit<WorkoutTemplate, 'id'>): Promise<WorkoutTemplate> {
    const { data, error } = await supabase
      .from('workout_templates')
      .insert([{
        name: template.name,
        description: template.description,
        exercises: template.exercises as any,
        category: template.category,
        favorite: template.favorite
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      exercises: data.exercises as any,
      category: data.category || undefined,
      favorite: data.favorite || false
    };
  },

  async updateTemplate(id: string, updates: Partial<WorkoutTemplate>): Promise<void> {
    const updateData: Record<string, any> = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.exercises) updateData.exercises = updates.exercises as any;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.favorite !== undefined) updateData.favorite = updates.favorite;
    
    const { error } = await supabase
      .from('workout_templates')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('workout_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Tasks
  async getTasks(): Promise<GymTask[]> {
    const { data, error } = await supabase
      .from('gym_tasks')
      .select('*')
      .is('user_id', null)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(t => ({
      ...t,
      date: new Date(t.date)
    }));
  },

  async addTask(task: Omit<GymTask, 'id'>): Promise<GymTask> {
    const { data, error } = await supabase
      .from('gym_tasks')
      .insert({
        user_id: null,
        title: task.title,
        completed: task.completed,
        date: new Date(task.date).toISOString().split('T')[0]
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      date: new Date(data.date)
    };
  },

  async updateTask(id: string, updates: Partial<GymTask>): Promise<void> {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.date) updateData.date = new Date(updates.date).toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('gym_tasks')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  },

  // Progress Images
  async getProgressImages(): Promise<ProgressImage[]> {
    const { data, error } = await supabase
      .from('progress_images')
      .select('*')
      .is('user_id', null)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(img => ({
      ...img,
      date: new Date(img.date)
    }));
  },

  async addProgressImage(image: Omit<ProgressImage, 'id'>): Promise<ProgressImage> {
    const { data, error } = await supabase
      .from('progress_images')
      .insert({
        user_id: null,
        url: image.url,
        date: new Date(image.date).toISOString().split('T')[0],
        notes: image.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      date: new Date(data.date)
    };
  }
};
