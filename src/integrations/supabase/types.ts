export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      gym_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      nutrition_goals: {
        Row: {
          calories: number
          carbs: number
          fats: number
          id: string
          protein: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs: number
          fats: number
          id?: string
          protein: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: number
          fats?: number
          id?: string
          protein?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nutrition_items: {
        Row: {
          calories: number
          carbs: number
          category: string | null
          created_at: string | null
          fats: number
          id: string
          is_vegetarian: boolean | null
          name: string
          protein: number
          timestamp: string
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs: number
          category?: string | null
          created_at?: string | null
          fats: number
          id?: string
          is_vegetarian?: boolean | null
          name: string
          protein: number
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: number
          category?: string | null
          created_at?: string | null
          fats?: number
          id?: string
          is_vegetarian?: boolean | null
          name?: string
          protein?: number
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      progress_data: {
        Row: {
          calories: number | null
          carbs: number | null
          date: string
          fats: number | null
          id: string
          protein: number | null
          user_id: string | null
          water: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          date: string
          fats?: number | null
          id?: string
          protein?: number | null
          user_id?: string | null
          water?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          date?: string
          fats?: number | null
          id?: string
          protein?: number | null
          user_id?: string | null
          water?: number | null
        }
        Relationships: []
      }
      progress_images: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      water_tracking: {
        Row: {
          date: string
          goal_ml: number
          id: string
          intake_ml: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          date?: string
          goal_ml?: number
          id?: string
          intake_ml?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          date?: string
          goal_ml?: number
          id?: string
          intake_ml?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workout_templates: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          exercises: Json
          favorite: boolean | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          exercises?: Json
          favorite?: boolean | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          exercises?: Json
          favorite?: boolean | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string | null
          date: string
          description: string | null
          duration: number | null
          end_time: string | null
          exercises: Json
          favorite: boolean | null
          id: string
          name: string
          recurring: boolean | null
          recurring_days: number[] | null
          start_time: string | null
          template_id: string | null
          user_id: string | null
          volume_total: number | null
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          date?: string
          description?: string | null
          duration?: number | null
          end_time?: string | null
          exercises?: Json
          favorite?: boolean | null
          id?: string
          name: string
          recurring?: boolean | null
          recurring_days?: number[] | null
          start_time?: string | null
          template_id?: string | null
          user_id?: string | null
          volume_total?: number | null
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          date?: string
          description?: string | null
          duration?: number | null
          end_time?: string | null
          exercises?: Json
          favorite?: boolean | null
          id?: string
          name?: string
          recurring?: boolean | null
          recurring_days?: number[] | null
          start_time?: string | null
          template_id?: string | null
          user_id?: string | null
          volume_total?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_water_tracking: {
        Args: {
          p_date: string
          p_goal_ml: number
          p_intake_ml: number
          p_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
