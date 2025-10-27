
// Database of common foods with nutrition data
export const foodDatabase = {
  // Proteins
  "Chicken Breast": { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  "Salmon": { calories: 208, protein: 20, carbs: 0, fats: 13 },
  "Eggs": { calories: 78, protein: 6, carbs: 0.6, fats: 5 },
  "Greek Yogurt": { calories: 100, protein: 10, carbs: 3.6, fats: 2.5 },
  "Tofu": { calories: 76, protein: 8, carbs: 1.9, fats: 4.2 },
  "Tuna": { calories: 116, protein: 26, carbs: 0, fats: 0.8 },
  "Lean Beef": { calories: 250, protein: 26, carbs: 0, fats: 17 },
  
  // Carbs
  "Brown Rice": { calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  "Sweet Potato": { calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
  "Oatmeal": { calories: 166, protein: 6, carbs: 28, fats: 3.6 },
  "Quinoa": { calories: 222, protein: 8, carbs: 39, fats: 3.6 },
  "Whole Wheat Bread": { calories: 81, protein: 4, carbs: 13.8, fats: 1.1 },
  "Banana": { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  "Apple": { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  
  // Fats
  "Avocado": { calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
  "Almonds": { calories: 164, protein: 6, carbs: 6, fats: 14 },
  "Olive Oil": { calories: 119, protein: 0, carbs: 0, fats: 13.5 },
  "Peanut Butter": { calories: 188, protein: 8, carbs: 6, fats: 16 },
  "Cheese": { calories: 113, protein: 7, carbs: 0.4, fats: 9 },
  
  // Mixed
  "Salad": { calories: 20, protein: 1, carbs: 3, fats: 0.2 },
  "Protein Shake": { calories: 120, protein: 24, carbs: 3, fats: 1 },
  "Protein Bar": { calories: 200, protein: 20, carbs: 20, fats: 5 },
  "Smoothie": { calories: 150, protein: 8, carbs: 25, fats: 3 },
  "Turkey Sandwich": { calories: 330, protein: 20, carbs: 40, fats: 9 },
};

// Database of common exercises with instructions
export const exerciseDatabase = {
  // Chest
  "Bench Press": {
    muscleGroup: "Chest",
    instructions: "Lie on a bench, grip the bar with hands slightly wider than shoulder-width. Lower the bar to your chest and press it back up.",
    difficulty: "Intermediate"
  },
  "Push-Ups": {
    muscleGroup: "Chest",
    instructions: "Place hands shoulder-width apart, lower body until chest nearly touches the floor, then push back up.",
    difficulty: "Beginner"
  },
  "Dumbbell Flyes": {
    muscleGroup: "Chest",
    instructions: "Lie on a bench holding dumbbells above your chest, lower them out to the sides, then bring them back together.",
    difficulty: "Intermediate"
  },
  
  // Back
  "Pull-Ups": {
    muscleGroup: "Back",
    instructions: "Hang from a bar with palms facing away, pull your body up until chin is over the bar.",
    difficulty: "Intermediate"
  },
  "Deadlift": {
    muscleGroup: "Back",
    instructions: "Stand with feet shoulder-width apart, bend at hips and knees to grip the bar, then stand up straight.",
    difficulty: "Advanced"
  },
  "Bent Over Row": {
    muscleGroup: "Back",
    instructions: "Bend at the hips, keep back straight. Pull the weight toward your lower ribcage.",
    difficulty: "Intermediate"
  },
  
  // Legs
  "Squats": {
    muscleGroup: "Legs",
    instructions: "Stand with feet shoulder-width apart, bend knees to lower body, keep back straight, then return to standing.",
    difficulty: "Intermediate"
  },
  "Lunges": {
    muscleGroup: "Legs",
    instructions: "Step forward with one leg, lower body until both knees are bent at 90 degrees, then push back up.",
    difficulty: "Beginner"
  },
  "Leg Press": {
    muscleGroup: "Legs",
    instructions: "Sit in the machine with feet on platform, push the platform away by extending knees, then return.",
    difficulty: "Beginner"
  },
  
  // Arms
  "Bicep Curls": {
    muscleGroup: "Arms",
    instructions: "Hold weights with arms extended, bend at the elbow to bring weights toward shoulders.",
    difficulty: "Beginner"
  },
  "Tricep Dips": {
    muscleGroup: "Arms",
    instructions: "Support yourself on parallel bars, lower body by bending arms, then push back up.",
    difficulty: "Intermediate"
  },
  "Skull Crushers": {
    muscleGroup: "Arms",
    instructions: "Lie on bench, hold weight above your head, bend elbows to lower weight toward forehead, then extend.",
    difficulty: "Intermediate"
  },
  
  // Shoulders
  "Shoulder Press": {
    muscleGroup: "Shoulders",
    instructions: "Sit or stand, hold weights at shoulder height, press weights overhead, then lower back down.",
    difficulty: "Intermediate"
  },
  "Lateral Raises": {
    muscleGroup: "Shoulders",
    instructions: "Stand with weights at sides, raise arms out to sides until parallel to floor, then lower.",
    difficulty: "Beginner"
  },
  
  // Core
  "Plank": {
    muscleGroup: "Core",
    instructions: "Support body on forearms and toes, keeping body in a straight line. Hold the position.",
    difficulty: "Beginner"
  },
  "Crunches": {
    muscleGroup: "Core",
    instructions: "Lie on back with knees bent, hands behind head, lift shoulders off the floor, then lower back down.",
    difficulty: "Beginner"
  },
  "Russian Twists": {
    muscleGroup: "Core",
    instructions: "Sit with knees bent, lean back slightly, twist torso to touch the ground on each side.",
    difficulty: "Intermediate"
  },
};

// Function to get nutrition data for a food
export const getFoodNutrition = (foodName: string) => {
  // Exact match
  if (foodDatabase[foodName]) {
    return foodDatabase[foodName];
  }
  
  // Search for partial match
  const foods = Object.keys(foodDatabase);
  for (const food of foods) {
    if (food.toLowerCase().includes(foodName.toLowerCase())) {
      return { ...foodDatabase[food], name: food };
    }
  }
  
  // Return default if no match found
  return null;
};

// Function to get exercise information
export const getExerciseInfo = (exerciseName: string) => {
  // Exact match
  if (exerciseDatabase[exerciseName]) {
    return { ...exerciseDatabase[exerciseName], name: exerciseName };
  }
  
  // Search for partial match
  const exercises = Object.keys(exerciseDatabase);
  for (const exercise of exercises) {
    if (exercise.toLowerCase().includes(exerciseName.toLowerCase())) {
      return { ...exerciseDatabase[exercise], name: exercise };
    }
  }
  
  // Return default if no match found
  return null;
};

// Function to get all food suggestions
export const getFoodSuggestions = () => {
  return Object.keys(foodDatabase);
};

// Function to get all exercise suggestions
export const getExerciseSuggestions = () => {
  return Object.keys(exerciseDatabase);
};
