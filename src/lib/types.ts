
export type WaterIntake = {
  id: string;
  amount: number; // in milliliters
  timestamp: Date;
};

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

export type NutritionItem = {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  timestamp: Date;
  isVegetarian?: boolean;
  category?: MealCategory;
};

export type WaterGoal = {
  daily: number; // in milliliters
};

export type NutritionGoal = {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
};

export type ProgressData = {
  date: string;
  water: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

// Gym-related types
export type Workout = {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  completed: boolean;
  date: Date;
  recurring?: boolean;
  recurringDays?: number[]; // 0-6 for days of week
  templateId?: string; // Reference to a template if this workout is based on one
  category?: string; // For categorizing workouts (e.g., "Upper Body", "Cardio")
  favorite?: boolean; // To mark favorite workouts
  volumeTotal?: number; // Total volume (weight × reps) in kg
};

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
  notes?: string;
  difficulty?: ExerciseDifficulty;
  targetMuscles?: string[]; // For filtering/analysis
  previousPerformance?: {
    date: Date;
    sets: ExerciseSet[];
  }[];
};

export type ExerciseSet = {
  id: string;
  reps: number;
  weight: number; // in kg
  duration?: number; // in seconds (for timed exercises)
  completed: boolean;
};

export type WorkoutSchedule = {
  id: string;
  workoutId: string;
  date: Date;
  time: string;
  recurring: boolean;
  recurringDays?: number[]; // 0-6 for days of week
};

export type GymTask = {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
};

export type ProgressImage = {
  id: string;
  url: string;
  date: Date;
  notes?: string;
};

// New types for templates and statistics
export type WorkoutTemplate = {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  category?: string;
  favorite?: boolean;
};

export type WorkoutStatistics = {
  totalWorkouts: number;
  completedWorkouts: number;
  totalExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number; // in kg
  averageWorkoutDuration: number; // in minutes
  mostFrequentExercises: {
    name: string;
    count: number;
  }[];
  workoutsByCategory: {
    category: string;
    count: number;
  }[];
  // Weekly summary
  weeklySummary: {
    week: string; // YYYY-WW format
    workouts: number;
    volume: number;
  }[];
};
