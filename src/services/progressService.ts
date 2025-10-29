import { supabase } from "@/integrations/supabase/client";
import { ProgressData } from "@/lib/types";

export const progressService = {
  async getWeeklyProgress(): Promise<ProgressData[]> {
    const today = new Date();
    const result: ProgressData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      // Get nutrition data for this date
      const { data: nutritionData } = await supabase
        .from('nutrition_items')
        .select('calories, protein, carbs, fats')
        .gte('timestamp', `${dateStr}T00:00:00`)
        .lt('timestamp', `${dateStr}T23:59:59`)
        .is('user_id', null);
      
      // Get water data for this date
      const { data: waterData } = await supabase
        .from('water_tracking')
        .select('intake_ml')
        .eq('date', dateStr)
        .is('user_id', null)
        .maybeSingle();
      
      const nutrition = (nutritionData || []).reduce(
        (acc, item) => ({
          calories: acc.calories + (Number(item.calories) || 0),
          protein: acc.protein + (Number(item.protein) || 0),
          carbs: acc.carbs + (Number(item.carbs) || 0),
          fats: acc.fats + (Number(item.fats) || 0)
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );
      
      result.push({
        date: dayName,
        water: waterData?.intake_ml || 0,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fats: nutrition.fats
      });
    }
    
    return result;
  },

  async upsertDailyProgress(date: Date, data: Omit<ProgressData, 'date'>): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('progress_data')
      .upsert({
        user_id: null,
        date: dateStr,
        water: data.water,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats
      }, {
        onConflict: 'user_id,date'
      });
    
    if (error) throw error;
  }
};
