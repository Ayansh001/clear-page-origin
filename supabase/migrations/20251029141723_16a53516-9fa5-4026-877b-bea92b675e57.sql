-- Create nutrition_items table
CREATE TABLE public.nutrition_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  calories DECIMAL NOT NULL CHECK (calories >= 0),
  protein DECIMAL NOT NULL CHECK (protein >= 0),
  carbs DECIMAL NOT NULL CHECK (carbs >= 0),
  fats DECIMAL NOT NULL CHECK (fats >= 0),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_vegetarian BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nutrition_goals table
CREATE TABLE public.nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  calories DECIMAL NOT NULL CHECK (calories > 0),
  protein DECIMAL NOT NULL CHECK (protein >= 0),
  carbs DECIMAL NOT NULL CHECK (carbs >= 0),
  fats DECIMAL NOT NULL CHECK (fats >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create water_tracking table
CREATE TABLE public.water_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  intake_ml INTEGER NOT NULL DEFAULT 0 CHECK (intake_ml >= 0),
  goal_ml INTEGER NOT NULL DEFAULT 2000 CHECK (goal_ml >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create progress_data table
CREATE TABLE public.progress_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  date DATE NOT NULL,
  water INTEGER DEFAULT 0,
  calories DECIMAL DEFAULT 0,
  protein DECIMAL DEFAULT 0,
  carbs DECIMAL DEFAULT 0,
  fats DECIMAL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  recurring BOOLEAN DEFAULT FALSE,
  recurring_days INTEGER[],
  template_id UUID,
  category TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  volume_total DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_templates table
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]',
  category TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gym_tasks table
CREATE TABLE public.gym_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress_images table
CREATE TABLE public.progress_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  url TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_nutrition_items_timestamp ON public.nutrition_items(timestamp);
CREATE INDEX idx_nutrition_items_user ON public.nutrition_items(user_id);
CREATE INDEX idx_water_tracking_date ON public.water_tracking(date);
CREATE INDEX idx_progress_data_date ON public.progress_data(date);
CREATE INDEX idx_workouts_date ON public.workouts(date);
CREATE INDEX idx_workouts_completed ON public.workouts(completed);
CREATE INDEX idx_gym_tasks_date ON public.gym_tasks(date);
CREATE INDEX idx_progress_images_date ON public.progress_images(date);

-- Enable Row Level Security on all tables
ALTER TABLE public.nutrition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_images ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies (no auth required for now)
CREATE POLICY "Allow all operations for nutrition_items" ON public.nutrition_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for nutrition_goals" ON public.nutrition_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for water_tracking" ON public.water_tracking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for progress_data" ON public.progress_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for workouts" ON public.workouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for workout_templates" ON public.workout_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for gym_tasks" ON public.gym_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for progress_images" ON public.progress_images FOR ALL USING (true) WITH CHECK (true);

-- Create helper function to upsert water tracking
CREATE OR REPLACE FUNCTION public.upsert_water_tracking(
  p_date DATE,
  p_intake_ml INTEGER,
  p_goal_ml INTEGER,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.water_tracking (user_id, date, intake_ml, goal_ml, updated_at)
  VALUES (p_user_id, p_date, p_intake_ml, p_goal_ml, NOW())
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    intake_ml = EXCLUDED.intake_ml,
    goal_ml = EXCLUDED.goal_ml,
    updated_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;