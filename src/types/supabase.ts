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
      api_usage: {
        Row: {
          campaign_id: string | null
          cost_brl: number | null
          cost_usd: number | null
          created_at: string
          error_message: string | null
          exchange_rate: number | null
          id: string
          input_tokens: number | null
          metadata: Json | null
          model: string | null
          output_tokens: number | null
          status: string | null
          storage_url: string | null
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          cost_brl?: number | null
          cost_usd?: number | null
          created_at?: string
          error_message?: string | null
          exchange_rate?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          status?: string | null
          storage_url?: string | null
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          cost_brl?: number | null
          cost_usd?: number | null
          created_at?: string
          error_message?: string | null
          exchange_rate?: number | null
          id?: string
          input_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          output_tokens?: number | null
          status?: string | null
          storage_url?: string | null
          type?: Database["public"]["Enums"]["call_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          dish_category: string | null
          dish_name: string
          functional_image_url: string | null
          generated_copy: string | null
          id: string
          promotional_image_url: string | null
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          dish_category?: string | null
          dish_name: string
          functional_image_url?: string | null
          generated_copy?: string | null
          id?: string
          promotional_image_url?: string | null
          type: Database["public"]["Enums"]["call_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          dish_category?: string | null
          dish_name?: string
          functional_image_url?: string | null
          generated_copy?: string | null
          id?: string
          promotional_image_url?: string | null
          type?: Database["public"]["Enums"]["call_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creations: {
        Row: {
          copywriting_texts: Json | null
          created_at: string | null
          format_selected: string
          id: string
          image_url: string
          prompt_metadata: Json | null
          user_id: string
        }
        Insert: {
          copywriting_texts?: Json | null
          created_at?: string | null
          format_selected: string
          id?: string
          image_url: string
          prompt_metadata?: Json | null
          user_id: string
        }
        Update: {
          copywriting_texts?: Json | null
          created_at?: string | null
          format_selected?: string
          id?: string
          image_url?: string
          prompt_metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          amount_paid_brl: number | null
          cost_brl: number | null
          created_at: string
          expires_at: string | null
          full_name: string | null
          id: string
          package_name: string | null
          reference_id: string | null
          tokens_input: number | null
          tokens_output: number | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          amount_paid_brl?: number | null
          cost_brl?: number | null
          created_at?: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          package_name?: string | null
          reference_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          amount_paid_brl?: number | null
          cost_brl?: number | null
          created_at?: string
          expires_at?: string | null
          full_name?: string | null
          id?: string
          package_name?: string | null
          reference_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          currency_pair: string
          fetched_at: string | null
          id: string
          rate: number
          source: string | null
        }
        Insert: {
          currency_pair: string
          fetched_at?: string | null
          id?: string
          rate: number
          source?: string | null
        }
        Update: {
          currency_pair?: string
          fetched_at?: string | null
          id?: string
          rate?: number
          source?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          credits: number
          cuisine_type: string | null
          current_tier: string
          email: string
          establishment_name: string | null
          full_name: string | null
          id: string
          is_suspended: boolean
          last_purchase_date: string | null
          logo_url: string | null
          menu_link: string | null
          phone: string | null
          role: string | null
          total_purchases: number
          total_spent_brl: number
        }
        Insert: {
          city?: string | null
          created_at?: string
          credits?: number
          cuisine_type?: string | null
          current_tier?: string
          email: string
          establishment_name?: string | null
          full_name?: string | null
          id: string
          is_suspended?: boolean
          last_purchase_date?: string | null
          logo_url?: string | null
          menu_link?: string | null
          phone?: string | null
          role?: string | null
          total_purchases?: number
          total_spent_brl?: number
        }
        Update: {
          city?: string | null
          created_at?: string
          credits?: number
          cuisine_type?: string | null
          current_tier?: string
          email?: string
          establishment_name?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean
          last_purchase_date?: string | null
          logo_url?: string | null
          menu_link?: string | null
          phone?: string | null
          role?: string | null
          total_purchases?: number
          total_spent_brl?: number
        }
        Relationships: []
      }
      prompt_presets: {
        Row: {
          camera_hardware: string
          created_at: string
          food_category: string
          id: string
          is_active: boolean
          lighting_setup: string
          negative_prompt: string
          style_override: string | null
          updated_at: string
        }
        Insert: {
          camera_hardware: string
          created_at?: string
          food_category: string
          id?: string
          is_active?: boolean
          lighting_setup: string
          negative_prompt: string
          style_override?: string | null
          updated_at?: string
        }
        Update: {
          camera_hardware?: string
          created_at?: string
          food_category?: string
          id?: string
          is_active?: boolean
          lighting_setup?: string
          negative_prompt?: string
          style_override?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_costs: {
        Row: {
          cost_credits: number
          created_at: string | null
          description: string | null
          id: string
          label: string
        }
        Insert: {
          cost_credits: number
          created_at?: string | null
          description?: string | null
          id: string
          label: string
        }
        Update: {
          cost_credits?: number
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          credit_amount: number
          mp_payment_id: string
          paid_amount_brl: number
          purchased_package: string
          target_user_id: string
        }
        Returns: Json
      }
      consume_credits: {
        Args: {
          p_reference_id: string
          p_service_id: string
          p_user_id: string
        }
        Returns: Json
      }
      decrement_credits: {
        Args: { credit_cost?: number; target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      call_type: "kit_completo" | "imagem_unica" | "apenas_copy"
      transaction_type:
        | "purchase"
        | "usage"
        | "admin_adjustment"
        | "onboarding_bonus"
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
    Enums: {
      call_type: ["kit_completo", "imagem_unica", "apenas_copy"],
      transaction_type: [
        "purchase",
        "usage",
        "admin_adjustment",
        "onboarding_bonus",
      ],
    },
  },
} as const
