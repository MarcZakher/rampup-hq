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
      assessment_criteria: {
        Row: {
          assessment_id: string | null
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_criteria_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_criteria_scores: {
        Row: {
          created_at: string
          criteria_id: string | null
          id: string
          score: number
          submission_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria_id?: string | null
          id?: string
          score: number
          submission_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria_id?: string | null
          id?: string
          score?: number
          submission_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_criteria_scores_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "assessment_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_criteria_scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assessment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_submissions: {
        Row: {
          areas_for_improvement: string | null
          assessment_id: string | null
          created_at: string
          feedback: string | null
          id: string
          manager_id: string | null
          observed_strengths: string | null
          recommended_actions: string | null
          sales_rep_id: string | null
          total_score: number
          updated_at: string
        }
        Insert: {
          areas_for_improvement?: string | null
          assessment_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          manager_id?: string | null
          observed_strengths?: string | null
          recommended_actions?: string | null
          sales_rep_id?: string | null
          total_score: number
          updated_at?: string
        }
        Update: {
          areas_for_improvement?: string | null
          assessment_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          manager_id?: string | null
          observed_strengths?: string | null
          recommended_actions?: string | null
          sales_rep_id?: string | null
          total_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_submissions_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_submissions_sales_rep_id_fkey"
            columns: ["sales_rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          period: Database["public"]["Enums"]["assessment_period"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          period: Database["public"]["Enums"]["assessment_period"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          period?: Database["public"]["Enums"]["assessment_period"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      meeting_analyses: {
        Row: {
          ai_feedback: string | null
          created_at: string
          id: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          sales_rep_id: string
          transcript: string
          updated_at: string
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          sales_rep_id: string
          transcript: string
          updated_at?: string
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          meeting_type?: Database["public"]["Enums"]["meeting_type"]
          sales_rep_id?: string
          transcript?: string
          updated_at?: string
        }
        Relationships: []
      }
      meeting_definitions: {
        Row: {
          created_at: string
          definition: string
          id: string
          ideal_scenario: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition: string
          id?: string
          ideal_scenario: string
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: string
          id?: string
          ideal_scenario?: string
          meeting_type?: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      training_journey_modules: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          period: Database["public"]["Enums"]["training_period"]
          platform: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          id?: string
          period: Database["public"]["Enums"]["training_period"]
          platform?: string | null
          sort_order: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          period?: Database["public"]["Enums"]["training_period"]
          platform?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          manager_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          manager_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          manager_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
      assessment_period: "month_1" | "month_2" | "month_3" | "month_4"
      meeting_type: "discovery" | "new_business"
      training_period: "month_1" | "month_2" | "month_3" | "month_4"
      user_role: "sales_rep" | "manager" | "director"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
