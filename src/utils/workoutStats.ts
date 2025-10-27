
import { Workout, Exercise, ExerciseSet, WorkoutStatistics } from '@/lib/types';
import { startOfWeek, format, parseISO, isValid } from 'date-fns';

/**
 * Calculate total volume (weight × reps) for a set
 */
export const calculateSetVolume = (set: ExerciseSet): number => {
  return set.weight * set.reps;
};

/**
 * Calculate total volume for an exercise
 */
export const calculateExerciseVolume = (exercise: Exercise): number => {
  return exercise.sets.reduce((total, set) => {
    return total + calculateSetVolume(set);
  }, 0);
};

/**
 * Calculate total volume for a workout
 */
export const calculateWorkoutVolume = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return total + calculateExerciseVolume(exercise);
  }, 0);
};

/**
 * Get the most frequent exercises across all workouts
 */
export const getMostFrequentExercises = (workouts: Workout[], limit: number = 5): { name: string; count: number }[] => {
  const exerciseCounts: Record<string, number> = {};
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exerciseCounts[exercise.name]) {
        exerciseCounts[exercise.name]++;
      } else {
        exerciseCounts[exercise.name] = 1;
      }
    });
  });
  
  return Object.entries(exerciseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Get workouts grouped by category
 */
export const getWorkoutsByCategory = (workouts: Workout[]): { category: string; count: number }[] => {
  const categoryCounts: Record<string, number> = {};
  
  workouts.forEach(workout => {
    const category = workout.category || 'Uncategorized';
    if (categoryCounts[category]) {
      categoryCounts[category]++;
    } else {
      categoryCounts[category] = 1;
    }
  });
  
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get weekly workout summary
 */
export const getWeeklySummary = (workouts: Workout[], weeks: number = 6): { week: string; workouts: number; volume: number }[] => {
  const weeklyData: Record<string, { workouts: number; volume: number }> = {};
  
  // Initialize the recent weeks
  const today = new Date();
  for (let i = 0; i < weeks; i++) {
    const weekStart = startOfWeek(new Date(today.getFullYear(), today.getMonth(), today.getDate() - (i * 7)));
    const weekKey = format(weekStart, 'yyyy-ww');
    weeklyData[weekKey] = { workouts: 0, volume: 0 };
  }
  
  // Group workouts by week
  workouts.forEach(workout => {
    const workoutDate = new Date(workout.date);
    if (isValid(workoutDate)) {
      const weekStart = startOfWeek(workoutDate);
      const weekKey = format(weekStart, 'yyyy-ww');
      
      if (weeklyData[weekKey]) {
        weeklyData[weekKey].workouts++;
        weeklyData[weekKey].volume += calculateWorkoutVolume(workout);
      }
    }
  });
  
  // Convert to array and sort by week
  return Object.entries(weeklyData)
    .map(([week, data]) => ({
      week,
      workouts: data.workouts,
      volume: data.volume
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

/**
 * Calculate comprehensive workout statistics
 */
export const calculateWorkoutStatistics = (workouts: Workout[]): WorkoutStatistics => {
  const completedWorkouts = workouts.filter(w => w.completed);
  
  const totalSets = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.length;
    }, 0);
  }, 0);
  
  const completedSets = workouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      return exerciseTotal + exercise.sets.filter(set => set.completed).length;
    }, 0);
  }, 0);
  
  const totalExercises = workouts.reduce((total, workout) => {
    return total + workout.exercises.length;
  }, 0);
  
  const totalVolume = workouts.reduce((total, workout) => {
    return total + calculateWorkoutVolume(workout);
  }, 0);
  
  const totalDuration = completedWorkouts.reduce((total, workout) => {
    return total + (workout.duration || 0);
  }, 0);
  
  const averageWorkoutDuration = completedWorkouts.length > 0
    ? Math.round(totalDuration / completedWorkouts.length)
    : 0;
  
  return {
    totalWorkouts: workouts.length,
    completedWorkouts: completedWorkouts.length,
    totalExercises,
    totalSets,
    completedSets,
    totalVolume,
    averageWorkoutDuration,
    mostFrequentExercises: getMostFrequentExercises(workouts),
    workoutsByCategory: getWorkoutsByCategory(workouts),
    weeklySummary: getWeeklySummary(workouts)
  };
};
