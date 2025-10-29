import { supabase } from "@/integrations/supabase/client";

export interface WaterTracking {
  id: string;
  date: Date;
  intake_ml: number;
  goal_ml: number;
}

export const waterService = {
  async getWaterTracking(date: Date): Promise<WaterTracking | null> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('water_tracking')
      .select('*')
      .eq('date', dateStr)
      .is('user_id', null)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      date: new Date(data.date),
      intake_ml: data.intake_ml,
      goal_ml: data.goal_ml
    };
  },

  async updateWaterTracking(date: Date, intake_ml: number, goal_ml: number): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];
    
    const { error } = await supabase.rpc('upsert_water_tracking', {
      p_date: dateStr,
      p_intake_ml: intake_ml,
      p_goal_ml: goal_ml,
      p_user_id: null
    });
    
    if (error) throw error;
  }
};
