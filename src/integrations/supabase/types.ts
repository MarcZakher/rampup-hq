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
      assessment_scores: {
        Row: {
          assessment_index: number
          created_at: string
          id: string
          manager_id: string
          month: string
          sales_rep_id: string
          score: number | null
          updated_at: string
        }
        Insert: {
          assessment_index: number
          created_at?: string
          id?: string
          manager_id: string
          month: string
          sales_rep_id: string
          score?: number | null
          updated_at?: string
        }
        Update: {
          assessment_index?: number
          created_at?: string
          id?: string
          manager_id?: string
          month?: string
          sales_rep_id?: string
          score?: number | null
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
      ramping_expectations: {
        Row: {
          created_at: string
          id: string
          metric: string
          month_1: string
          month_2: string
          month_3: string
          month_4: string
          month_5: string
          month_6: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric: string
          month_1?: string
          month_2?: string
          month_3?: string
          month_4?: string
          month_5?: string
          month_6?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric?: string
          month_1?: string
          month_2?: string
          month_3?: string
          month_4?: string
          month_5?: string
          month_6?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          period_id: string
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
          period_id: string
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
          period_id?: string
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meeting_type: "discovery" | "new_business"
      training_period: "month1" | "month2" | "month3" | "month4"
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
