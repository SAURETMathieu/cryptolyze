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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      api_key: {
        Row: {
          created_at: string
          expired_at: string
          id: number
          key: string
          name: string
          read: boolean
          updated_at: string | null
          wallet_id: number
          write: boolean
        }
        Insert: {
          created_at?: string
          expired_at: string
          id?: number
          key: string
          name: string
          read: boolean
          updated_at?: string | null
          wallet_id: number
          write: boolean
        }
        Update: {
          created_at?: string
          expired_at?: string
          id?: number
          key?: string
          name?: string
          read?: boolean
          updated_at?: string | null
          wallet_id?: number
          write?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "api_key_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      balance_history: {
        Row: {
          created_at: string
          crypto_id: number
          id: number
          nb_token: number
          percent: number | null
          price: number | null
          price24h: number | null
          timestamp: string
          updated_at: string | null
          wallet_id: number
        }
        Insert: {
          created_at?: string
          crypto_id: number
          id?: number
          nb_token: number
          percent?: number | null
          price?: number | null
          price24h?: number | null
          timestamp?: string
          updated_at?: string | null
          wallet_id: number
        }
        Update: {
          created_at?: string
          crypto_id?: number
          id?: number
          nb_token?: number
          percent?: number | null
          price?: number | null
          price24h?: number | null
          timestamp?: string
          updated_at?: string | null
          wallet_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "balance_history_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_history_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_history_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      bot: {
        Row: {
          api_key_id: number
          created_at: string
          crypto_id: number
          ending_balance: number
          id: number
          max_invest: number
          max_trade_open: number
          name: string
          starting_balance: number
          status: Database["public"]["Enums"]["bot_status"]
          strategy_id: number
          updated_at: string | null
        }
        Insert: {
          api_key_id: number
          created_at?: string
          crypto_id: number
          ending_balance: number
          id?: number
          max_invest: number
          max_trade_open?: number
          name: string
          starting_balance: number
          status?: Database["public"]["Enums"]["bot_status"]
          strategy_id: number
          updated_at?: string | null
        }
        Update: {
          api_key_id?: number
          created_at?: string
          crypto_id?: number
          ending_balance?: number
          id?: number
          max_invest?: number
          max_trade_open?: number
          name?: string
          starting_balance?: number
          status?: Database["public"]["Enums"]["bot_status"]
          strategy_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategy"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          created_at: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      crypto: {
        Row: {
          asset: string
          created_at: string
          currency: string
          digit: number
          first_year: number | null
          id: number
          logo_url: string
          name: string
          updated_at: string | null
        }
        Insert: {
          asset: string
          created_at?: string
          currency?: string
          digit: number
          first_year?: number | null
          id?: number
          logo_url: string
          name: string
          updated_at?: string | null
        }
        Update: {
          asset?: string
          created_at?: string
          currency?: string
          digit?: number
          first_year?: number | null
          id?: number
          logo_url?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crypto_day_history: {
        Row: {
          average_price: number
          close_price: number
          crypto_id: number
          date: string
          id: number
          max_price: number
          min_price: number
          open_price: number
          prices_per_minute: number[]
          volume: number | null
        }
        Insert: {
          average_price: number
          close_price: number
          crypto_id: number
          date: string
          id?: number
          max_price: number
          min_price: number
          open_price: number
          prices_per_minute: number[]
          volume?: number | null
        }
        Update: {
          average_price?: number
          close_price?: number
          crypto_id?: number
          date?: string
          id?: number
          max_price?: number
          min_price?: number
          open_price?: number
          prices_per_minute?: number[]
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_day_history_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crypto_day_history_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accept_terms_at: string | null
          accept_terms_history: Json[] | null
          accept_terms_version: string | null
          ban_reason: string | null
          banned_until: string | null
          birth_date: string
          created_at: string
          deleted_at: string | null
          email: string
          first_name: string
          id: string
          language: string
          last_name: string
          nb_banned: number
          role: Database["public"]["Enums"]["role"]
          updated_at: string | null
        }
        Insert: {
          accept_terms_at?: string | null
          accept_terms_history?: Json[] | null
          accept_terms_version?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          birth_date: string
          created_at?: string
          deleted_at?: string | null
          email: string
          first_name: string
          id: string
          language?: string
          last_name: string
          nb_banned?: number
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
        }
        Update: {
          accept_terms_at?: string | null
          accept_terms_history?: Json[] | null
          accept_terms_version?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          birth_date?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          first_name?: string
          id?: string
          language?: string
          last_name?: string
          nb_banned?: number
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          permission: string
          role: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          permission: string
          role: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          permission?: string
          role?: string
        }
        Relationships: []
      }
      strategy: {
        Row: {
          created_at: string
          description: string
          execution_delay: number
          id: number
          multiplier: number
          name: string
          percent_per_trade_down: number
          percent_per_trade_up: number
          starting_multiplier: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          execution_delay?: number
          id?: number
          multiplier?: number
          name: string
          percent_per_trade_down?: number
          percent_per_trade_up?: number
          starting_multiplier?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          execution_delay?: number
          id?: number
          multiplier?: number
          name?: string
          percent_per_trade_down?: number
          percent_per_trade_up?: number
          starting_multiplier?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      strategy_test: {
        Row: {
          average_price: number
          average_trade_open: number
          created_at: string
          crypto_id: number
          ending_price: number
          fees: number
          id: number
          max_invest: number
          max_trade_open: number
          nb_token: number
          nb_trade_closed: number
          nb_trade_open: number
          percent: number
          profit: number
          profit_percent: number
          starting_price: number
          strategy_id: number
          updated_at: string | null
          year: number
        }
        Insert: {
          average_price: number
          average_trade_open?: number
          created_at?: string
          crypto_id: number
          ending_price: number
          fees: number
          id?: number
          max_invest: number
          max_trade_open?: number
          nb_token: number
          nb_trade_closed: number
          nb_trade_open: number
          percent: number
          profit: number
          profit_percent: number
          starting_price: number
          strategy_id: number
          updated_at?: string | null
          year: number
        }
        Update: {
          average_price?: number
          average_trade_open?: number
          created_at?: string
          crypto_id?: number
          ending_price?: number
          fees?: number
          id?: number
          max_invest?: number
          max_trade_open?: number
          nb_token?: number
          nb_trade_closed?: number
          nb_trade_open?: number
          percent?: number
          profit?: number
          profit_percent?: number
          starting_price?: number
          strategy_id?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategy_test_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_test_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_test_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategy"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_test_history: {
        Row: {
          average_price: number
          average_trade_open: number
          date: string
          max_invest: number
          max_trade_open: number
          nb_token: number
          nb_trade_closed: number
          nb_trade_open: number
          profit: number
          profit_percent: number
          strategy_test_id: number
        }
        Insert: {
          average_price: number
          average_trade_open?: number
          date: string
          max_invest: number
          max_trade_open?: number
          nb_token: number
          nb_trade_closed: number
          nb_trade_open: number
          profit: number
          profit_percent: number
          strategy_test_id: number
        }
        Update: {
          average_price?: number
          average_trade_open?: number
          date?: string
          max_invest?: number
          max_trade_open?: number
          nb_token?: number
          nb_trade_closed?: number
          nb_trade_open?: number
          profit?: number
          profit_percent?: number
          strategy_test_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategy_test_history_strategy_test_id_fkey"
            columns: ["strategy_test_id"]
            isOneToOne: false
            referencedRelation: "strategy_test"
            referencedColumns: ["id"]
          },
        ]
      }
      trade: {
        Row: {
          bot_id: number
          buy_fees: number | null
          buy_price: number | null
          buy_timestamp: string
          created_at: string
          currency: string
          id: number
          nb_token: number | null
          sell_fees: number | null
          sell_price: number | null
          sell_timestamp: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          bot_id: number
          buy_fees?: number | null
          buy_price?: number | null
          buy_timestamp?: string
          created_at?: string
          currency?: string
          id?: number
          nb_token?: number | null
          sell_fees?: number | null
          sell_price?: number | null
          sell_timestamp?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          bot_id?: number
          buy_fees?: number | null
          buy_price?: number | null
          buy_timestamp?: string
          created_at?: string
          currency?: string
          id?: number
          nb_token?: number | null
          sell_fees?: number | null
          sell_price?: number | null
          sell_timestamp?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bot"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction: {
        Row: {
          created_at: string
          crypto_id: number
          fees: number | null
          from_address: string | null
          from_label: string | null
          id: number
          idx: string
          price: number | null
          status: number | null
          timestamp: string
          to_address: string | null
          to_label: string | null
          type: string | null
          updated_at: string | null
          value: number | null
          wallet_id: number
        }
        Insert: {
          created_at?: string
          crypto_id: number
          fees?: number | null
          from_address?: string | null
          from_label?: string | null
          id?: number
          idx: string
          price?: number | null
          status?: number | null
          timestamp?: string
          to_address?: string | null
          to_label?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
          wallet_id: number
        }
        Update: {
          created_at?: string
          crypto_id?: number
          fees?: number | null
          from_address?: string | null
          from_label?: string | null
          id?: number
          idx?: string
          price?: number | null
          status?: number | null
          timestamp?: string
          to_address?: string | null
          to_label?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
          wallet_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          address: string | null
          blockchain: string
          created_at: string
          exchange: string | null
          id: number
          name: string
          profile_id: string
          sync_at: string | null
          type: Database["public"]["Enums"]["wallet_type"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          blockchain?: string
          created_at?: string
          exchange?: string | null
          id?: number
          name: string
          profile_id?: string
          sync_at?: string | null
          type: Database["public"]["Enums"]["wallet_type"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          blockchain?: string
          created_at?: string
          exchange?: string | null
          id?: number
          name?: string
          profile_id?: string
          sync_at?: string | null
          type?: Database["public"]["Enums"]["wallet_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_cryptos: {
        Row: {
          crypto_id: number
          nb_token: number
          percent: number | null
          price: number | null
          price24h: number | null
          updated_at: string | null
          wallet_id: number
        }
        Insert: {
          crypto_id: number
          nb_token: number
          percent?: number | null
          price?: number | null
          price24h?: number | null
          updated_at?: string | null
          wallet_id: number
        }
        Update: {
          crypto_id?: number
          nb_token?: number
          percent?: number | null
          price?: number | null
          price24h?: number | null
          updated_at?: string | null
          wallet_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wallet_cryptos_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_cryptos_crypto_id_fkey"
            columns: ["crypto_id"]
            isOneToOne: false
            referencedRelation: "crypto_yearly_history_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_cryptos_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      crypto_yearly_history_status: {
        Row: {
          asset: string | null
          complete_years: number | null
          created_at: string | null
          currency: string | null
          digit: number | null
          first_year: number | null
          history_completeness: Json | null
          id: number | null
          incomplete_years: number | null
          logo_url: string | null
          name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bot_status: "running" | "stopped" | "paused" | "error" | "awaiting_start"
      role: "User" | "Team"
      wallet_type: "centralized" | "decentralized"
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
      bot_status: ["running", "stopped", "paused", "error", "awaiting_start"],
      role: ["User", "Team"],
      wallet_type: ["centralized", "decentralized"],
    },
  },
} as const
