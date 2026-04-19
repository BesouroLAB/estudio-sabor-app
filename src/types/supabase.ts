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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_usage_logs: {
        Row: {
          action_type: string
          cost_brl: number | null
          created_at: string | null
          credits_used: number | null
          estimated_profit_brl: number | null
          estimated_value_brl: number | null
          id: string
          input_tokens: number | null
          metadata: Json | null
          model_name: string | null
          output_tokens: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          cost_brl?: number | null
          created_at?: string | null
          credits_used?: number | null
          estimated_profit_brl?: number | null
          estimated_value_brl?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_tokens?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          cost_brl?: number | null
          created_at?: string | null
          credits_used?: number | null
          estimated_profit_brl?: number | null
          estimated_value_brl?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_tokens?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          call_type: string
          cost_brl: number | null
          cost_usd: number | null
          created_at: string | null
          downloaded_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          model: string
          status: string | null
          storage_url: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          call_type: string
          cost_brl?: number | null
          cost_usd?: number | null
          created_at?: string | null
          downloaded_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model: string
          status?: string | null
          storage_url?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          call_type?: string
          cost_brl?: number | null
          cost_usd?: number | null
          created_at?: string | null
          downloaded_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model?: string
          status?: string | null
          storage_url?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      checklists: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          notice_id: string | null
          task_text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          notice_id?: string | null
          task_text: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          notice_id?: string | null
          task_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          currency_pair: string | null
          fetched_at: string | null
          id: string
          rate: number
        }
        Insert: {
          currency_pair?: string | null
          fetched_at?: string | null
          id?: string
          rate: number
        }
        Update: {
          currency_pair?: string | null
          fetched_at?: string | null
          id?: string
          rate?: number
        }
        Relationships: []
      }
      ideas: {
        Row: {
          concept: string | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          impact: string | null
          innovation: string | null
          notice_id: string | null
          registration_deadline: string | null
          title: string
          user_id: string
          why_high_scores: string | null
        }
        Insert: {
          concept?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: string | null
          innovation?: string | null
          notice_id?: string | null
          registration_deadline?: string | null
          title: string
          user_id: string
          why_high_scores?: string | null
        }
        Update: {
          concept?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: string | null
          innovation?: string | null
          notice_id?: string | null
          registration_deadline?: string | null
          title?: string
          user_id?: string
          why_high_scores?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          analysis_result: Json | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          registration_deadline: string | null
          status: string | null
          summary: string | null
          tasks: Json | null
          title: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          registration_deadline?: string | null
          status?: string | null
          summary?: string | null
          tasks?: Json | null
          title: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          registration_deadline?: string | null
          status?: string | null
          summary?: string | null
          tasks?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          credits: number | null
          document_id: string | null
          email: string | null
          full_name: string | null
          id: string
          is_blocked: boolean | null
          last_billing_date: string | null
          organization_name: string | null
          plan_type: string | null
          plan_value: number | null
          role: string | null
          total_tokens_consumed: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits?: number | null
          document_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_blocked?: boolean | null
          last_billing_date?: string | null
          organization_name?: string | null
          plan_type?: string | null
          plan_value?: number | null
          role?: string | null
          total_tokens_consumed?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits?: number | null
          document_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          last_billing_date?: string | null
          organization_name?: string | null
          plan_type?: string | null
          plan_value?: number | null
          role?: string | null
          total_tokens_consumed?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          feasibility_report: Json | null
          id: string
          notice_id: string | null
          registration_deadline: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feasibility_report?: Json | null
          id?: string
          notice_id?: string | null
          registration_deadline?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feasibility_report?: Json | null
          id?: string
          notice_id?: string | null
          registration_deadline?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          daily_budget_brl: number | null
          id: string
          is_safe_mode: boolean | null
          updated_at: string | null
        }
        Insert: {
          daily_budget_brl?: number | null
          id?: string
          is_safe_mode?: boolean | null
          updated_at?: string | null
        }
        Update: {
          daily_budget_brl?: number | null
          id?: string
          is_safe_mode?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_is_admin: { Args: never; Returns: boolean }
      decrement_credits: { Args: { user_id: string }; Returns: undefined }
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
