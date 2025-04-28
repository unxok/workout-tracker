export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          created_by: string
          id: number
          link: string | null
          notes: string | null
          primary_muscle: number | null
          target_type: Database["public"]["Enums"]["exercise_target_type"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          link?: string | null
          notes?: string | null
          primary_muscle?: number | null
          target_type?: Database["public"]["Enums"]["exercise_target_type"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          link?: string | null
          notes?: string | null
          primary_muscle?: number | null
          target_type?: Database["public"]["Enums"]["exercise_target_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_primary_muscle_fkey"
            columns: ["primary_muscle"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      muscles: {
        Row: {
          created_at: string
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: number
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string
          created_by: string
          id: number
          link: string | null
          notes: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          link?: string | null
          notes?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          link?: string | null
          notes?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      "routine-exercise-link": {
        Row: {
          block_id: number
          created_at: string
          exercise_id: number
          id: number
          reps_max: number
          reps_min: number
          sets: number
        }
        Insert: {
          block_id: number
          created_at?: string
          exercise_id: number
          id?: number
          reps_max: number
          reps_min: number
          sets: number
        }
        Update: {
          block_id?: number
          created_at?: string
          exercise_id?: number
          id?: number
          reps_max?: number
          reps_min?: number
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "block-exercise-link_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "block-exercise-link_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string
          id: number
          notes: string | null
          program_id: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          notes?: string | null
          program_id: number
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          notes?: string | null
          program_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      "workout-exercise-link": {
        Row: {
          created_at: string
          exercise_id: number
          id: number
          notes: string | null
          workout_id: number
        }
        Insert: {
          created_at?: string
          exercise_id: number
          id?: number
          notes?: string | null
          workout_id: number
        }
        Update: {
          created_at?: string
          exercise_id?: number
          id?: number
          notes?: string | null
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout-exercise-link_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout-exercise-link_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      "workout-exercise-set-link": {
        Row: {
          created_at: string
          id: number
          notes: string | null
          reps: number
          weight: number
          workout_exercise_link_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          notes?: string | null
          reps: number
          weight: number
          workout_exercise_link_id: number
        }
        Update: {
          created_at?: string
          id?: number
          notes?: string | null
          reps?: number
          weight?: number
          workout_exercise_link_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout-exercise-set-link_workout_exercise_link_id_fkey"
            columns: ["workout_exercise_link_id"]
            isOneToOne: false
            referencedRelation: "workout-exercise-link"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          block_id: number
          created_at: string
          date: string
          id: number
          notes: string | null
          user_id: string
        }
        Insert: {
          block_id: number
          created_at?: string
          date: string
          id?: number
          notes?: string | null
          user_id: string
        }
        Update: {
          block_id?: number
          created_at?: string
          date?: string
          id?: number
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      exercise_target_type: "isolation" | "compound"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      exercise_target_type: ["isolation", "compound"],
    },
  },
} as const
