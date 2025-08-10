export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  admin: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      get_profiles_with_auth_view: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          pg_role: string | null
          role: Database["public"]["Enums"]["role"] | null
        }
        Relationships: []
      }
      profiles_to_verify: {
        Row: {
          accept_terms_at: string | null
          accept_terms_history: Json[] | null
          accept_terms_version: string | null
          ban_reason: string | null
          banned_until: string | null
          birth_date: string | null
          company: Json | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_verified: boolean | null
          language: string | null
          last_name: string | null
          nb_banned: number | null
          newsletter: boolean | null
          pro_infos_verified:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          pro_infos_verified_at: string | null
          role: Database["public"]["Enums"]["role"] | null
          sumsub_id: string | null
          type: Database["public"]["Enums"]["user_type"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      role_permissions_view: {
        Row: {
          action: string | null
          has_grant: boolean | null
          permission_exists: boolean | null
          role_name: unknown | null
          schema_name: unknown | null
          table_name: unknown | null
        }
        Relationships: []
      }
      triggers_with_details: {
        Row: {
          enabled: unknown | null
          full_table_name: string | null
          function_definition: string | null
          function_name: unknown | null
          function_owner: unknown | null
          function_schema: unknown | null
          on_delete: boolean | null
          on_insert: boolean | null
          on_truncate: boolean | null
          on_update: boolean | null
          table_name: unknown | null
          table_schema: unknown | null
          trigger_comment: string | null
          trigger_definition: string | null
          trigger_name: unknown | null
          trigger_scope: string | null
          trigger_timing: string | null
          update_columns: unknown[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      ban_profile: {
        Args: {
          p_banned_until: string
          p_ban_reason: string
          p_profile_id: string
          p_is_update?: boolean
        }
        Returns: undefined
      }
      can_send_new_email_email: {
        Args: { p_profile_id: string }
        Returns: boolean
      }
      can_send_new_verification_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      can_send_recover_password_email: {
        Args: { email_input: string }
        Returns: boolean
      }
      cancel_ban_profile: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
      disable_trigger: {
        Args: {
          trigger_schema: string
          trigger_table: string
          trigger_name: string
        }
        Returns: undefined
      }
      enable_trigger: {
        Args: {
          trigger_schema: string
          trigger_table: string
          trigger_name: string
        }
        Returns: undefined
      }
      get_banned_user_infos: {
        Args: { p_email: string; p_plain_password: string }
        Returns: {
          user_banned_until: string
          ban_reason_message: string
        }[]
      }
      get_columns_privileges: {
        Args: {
          input_schema: string
          input_role: string
          input_table_name: string
        }
        Returns: {
          column: string
          can_insert: boolean
          can_update: boolean
          can_select: boolean
          can_references: boolean
        }[]
      }
      get_functions_privileges: {
        Args: { input_schema: string; input_role: string }
        Returns: {
          function_schema: string
          function_name: string
          function_specific_name: string
          can_execute: boolean
        }[]
      }
      get_ranked_listings: {
        Args: {
          p_reference_id?: number
          p_variant_id?: number
          p_rank_limit?: number
          p_profile_id?: string
          p_with_offer_only?: boolean
        }
        Returns: {
          id: number
          price: number
          expires_at: string
          profile_id: string
          vat: Database["public"]["Enums"]["tva_type"]
          reference_id: number
          variant_id: number
          size: string
          wtb_quantity: number
          wtb: boolean
          wtb_price: number
          lowest_price_size: number
          url_image: string
          name: string
          sku: string
          brand: Database["public"]["Enums"]["brand"]
          first_name: string
          last_name: string
          email: string
          type: Database["public"]["Enums"]["user_type"]
          country: string
          offer_id: number
          offer_status: Database["public"]["Enums"]["offer_status_type"]
          offer_price: number
          offer_created_at: string
          offer_updated_at: string
          offer_expires_at: string
          offer_view_at: string
          price_with_vat: number
          rank: number
          deal_count: number
          non_pending_offers: Json
          profile_listings_count: number
          best_price: number
          last_price: number
        }[]
      }
      get_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
        }[]
      }
      get_schemas: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
        }[]
      }
      get_schemas_privileges: {
        Args: { input_role: string }
        Returns: {
          schema_name: string
          usage_privilege: boolean
        }[]
      }
      get_tables_privileges: {
        Args: { input_schema: string; input_role: string }
        Returns: {
          grantee: string
          table_schema: string
          table_name: string
          table_type: string
          can_select: boolean
          partial_select: boolean
          can_insert: boolean
          partial_insert: boolean
          can_update: boolean
          partial_update: boolean
          can_delete: boolean
          can_reference: boolean
          can_trigger: boolean
          can_truncate: boolean
        }[]
      }
      insert_new_order: {
        Args: {
          p_country: string
          p_customer_id: number
          p_date: string
          p_payment_method: string
          p_source: string
          p_order_items: Database["public"]["CompositeTypes"]["order_item_type"][]
          p_address_first_name: string
          p_address_last_name: string
          p_address_main: string
          p_address_country: string
          p_address_zipcode: string
          p_address_city: string
          p_address_phone: string
          p_address_complement?: string
          p_order_payment_provider?: string
          p_order_payment_provider_id?: string
          p_order_reference_source?: string
          p_order_id_source?: string
        }
        Returns: boolean
      }
      insert_new_role: {
        Args: { role_name: string }
        Returns: string
      }
      insert_product_ref: {
        Args: { items: Json }
        Returns: undefined
      }
      insert_product_with_references: {
        Args: {
          name: string
          is_online: boolean
          brand: string
          collection: string
          type: string
          reference_items: Json[]
          url_image: string
          prestashop_id?: string
          description?: string
        }
        Returns: boolean
      }
      insert_reference_with_variants: {
        Args: {
          p_name: string
          p_sku: string
          p_brand: string
          p_collection: string
          p_colors: string[]
          p_size_chart: string
          p_size_guide: string
          p_is_online: boolean
          p_release_date: string
          p_url_image: string
          p_variant_items: Json[]
          p_verified: boolean
          p_retailed: boolean
          p_model: string
          p_colorway?: string
          p_sizing?: string
          p_product_id?: string
          p_sx_product_id?: string
          p_sx_slug?: string
        }
        Returns: number
      }
      insert_shipping_in: {
        Args: {
          p_deals_id: number[]
          p_tracking_number: string
          p_shipping_method: string
          p_tracking_link: string
          p_current_status: string
          p_parcel_id: number
          p_shipping_fees: number
          p_profile_id: string
        }
        Returns: Record<string, unknown>
      }
      update_columns_permissions: {
        Args: { p_permissions: Json[] }
        Returns: boolean
      }
      update_email_send_for_multiple_deals: {
        Args: { deals_info: Json[] }
        Returns: undefined
      }
      update_function_permissions: {
        Args: { p_permissions: Json[] }
        Returns: boolean
      }
      update_order: {
        Args: {
          p_order_id: number
          p_address_delivery_id: number
          p_country: string
          p_customer_id: number
          p_date: string
          p_payment_method: string
          p_source: string
          p_order_items: Database["public"]["CompositeTypes"]["order_item_type"][]
          p_address_first_name: string
          p_address_last_name: string
          p_address_main: string
          p_address_country: string
          p_address_zipcode: string
          p_address_city: string
          p_address_phone: string
          p_address_complement?: string
          p_order_payment_provider?: string
          p_order_payment_provider_id?: string
          p_order_reference_source?: string
          p_order_id_source?: string
        }
        Returns: boolean
      }
      update_permissions: {
        Args: { p_permissions: Json[] }
        Returns: boolean
      }
      update_product_with_references: {
        Args: {
          p_name: string
          p_is_online: boolean
          p_brand: string
          p_collection: string
          p_type: string
          p_reference_items: Json[]
          p_product_id: number
          p_prestashop_id?: string
          p_description?: string
        }
        Returns: boolean
      }
      update_reference_with_variants: {
        Args: {
          p_reference_id: number
          p_name: string
          p_sku: string
          p_brand: string
          p_collection: string
          p_colors: string[]
          p_size_chart: string
          p_size_guide: string
          p_is_online: boolean
          p_release_date: string
          p_variant_items: Json[]
          p_verified: boolean
          p_retailed: boolean
          p_model: string
          p_colorway?: string
          p_sizing?: string
          p_product_id?: string
          p_sx_product_id?: string
          p_sx_slug?: string
        }
        Returns: boolean
      }
      update_schemas_permissions: {
        Args: { p_permissions: Json[] }
        Returns: boolean
      }
      update_user_role: {
        Args: { p_role: string; p_user_id: string }
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
  erp: {
    Tables: {
      address_delivery: {
        Row: {
          address: string
          city: string
          complement: string | null
          country: string
          created_at: string
          first_name: string
          id: number
          last_name: string
          phone: string | null
          service_point_id: string | null
          state: string | null
          updated_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          complement?: string | null
          country: string
          created_at?: string
          first_name: string
          id?: number
          last_name: string
          phone?: string | null
          service_point_id?: string | null
          state?: string | null
          updated_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          first_name?: string
          id?: number
          last_name?: string
          phone?: string | null
          service_point_id?: string | null
          state?: string | null
          updated_at?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      customer: {
        Row: {
          airtable_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          prestashop_id: number | null
          token: string | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          prestashop_id?: number | null
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          prestashop_id?: number | null
          token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_chat_history: {
        Row: {
          created_at: string | null
          customer_id: number | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_chat_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      model_collection: {
        Row: {
          collection: string | null
          id: number
          model: string
        }
        Insert: {
          collection?: string | null
          id?: number
          model: string
        }
        Update: {
          collection?: string | null
          id?: number
          model?: string
        }
        Relationships: []
      }
      order: {
        Row: {
          address_delivery_id: number | null
          created_at: string
          customer_id: number
          date: string
          id: number
          language: string
          order_id_source: string | null
          order_reference_source: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          shipping_fees_ttc: number
          shipping_method: string | null
          source: string
          updated_at: string | null
        }
        Insert: {
          address_delivery_id?: number | null
          created_at?: string
          customer_id: number
          date: string
          id?: number
          language?: string
          order_id_source?: string | null
          order_reference_source?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          shipping_fees_ttc?: number
          shipping_method?: string | null
          source: string
          updated_at?: string | null
        }
        Update: {
          address_delivery_id?: number | null
          created_at?: string
          customer_id?: number
          date?: string
          id?: number
          language?: string
          order_id_source?: string | null
          order_reference_source?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          shipping_fees_ttc?: number
          shipping_method?: string | null
          source?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_address_delivery_id_fkey"
            columns: ["address_delivery_id"]
            isOneToOne: false
            referencedRelation: "address_delivery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      order_discount: {
        Row: {
          amount: number
          code: string
          created_at: string
          id: number
          name: string
          order_id: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          code: string
          created_at?: string
          id?: number
          name: string
          order_id: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          id?: number
          name?: string
          order_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_discount_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
        ]
      }
      order_item: {
        Row: {
          airtable_id: string | null
          cancelled_reason: string | null
          cancelled_reason_custom: string | null
          comment: string | null
          created_at: string
          current_status: Database["erp"]["Enums"]["order_item_status_enum"]
          discounted_price_ttc: number
          estimated_delivery_max: string | null
          estimated_delivery_min: string | null
          exact_sku: string | null
          full_price_ttc: number
          id: number
          marketplace_order_line_id: string | null
          matching_history:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_id: number
          prevent_matching: boolean
          prevent_wtb: boolean
          product_id: number
          rarity: string | null
          size: string
          state: string | null
          state_updated_at: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at: string | null
          vat_amount: number | null
        }
        Insert: {
          airtable_id?: string | null
          cancelled_reason?: string | null
          cancelled_reason_custom?: string | null
          comment?: string | null
          created_at?: string
          current_status?: Database["erp"]["Enums"]["order_item_status_enum"]
          discounted_price_ttc: number
          estimated_delivery_max?: string | null
          estimated_delivery_min?: string | null
          exact_sku?: string | null
          full_price_ttc: number
          id?: number
          marketplace_order_line_id?: string | null
          matching_history?:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_id: number
          prevent_matching?: boolean
          prevent_wtb?: boolean
          product_id: number
          rarity?: string | null
          size: string
          state?: string | null
          state_updated_at?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Update: {
          airtable_id?: string | null
          cancelled_reason?: string | null
          cancelled_reason_custom?: string | null
          comment?: string | null
          created_at?: string
          current_status?: Database["erp"]["Enums"]["order_item_status_enum"]
          discounted_price_ttc?: number
          estimated_delivery_max?: string | null
          estimated_delivery_min?: string | null
          exact_sku?: string | null
          full_price_ttc?: number
          id?: number
          marketplace_order_line_id?: string | null
          matching_history?:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_id?: number
          prevent_matching?: boolean
          prevent_wtb?: boolean
          product_id?: number
          rarity?: string | null
          size?: string
          state?: string | null
          state_updated_at?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_item_has_shipping: {
        Row: {
          order_item_id: number
          shipping_id: number
        }
        Insert: {
          order_item_id: number
          shipping_id: number
        }
        Update: {
          order_item_id?: number
          shipping_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_shipping_id_fkey"
            columns: ["shipping_id"]
            isOneToOne: false
            referencedRelation: "shipping"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_has_shipping_shipping_id_fkey"
            columns: ["shipping_id"]
            isOneToOne: false
            referencedRelation: "shipping_with_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_options: {
        Row: {
          created_at: string
          id: number
          order_item_id: number | null
          price_ttc: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          order_item_id?: number | null
          price_ttc?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          order_item_id?: number | null
          price_ttc?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          brand: Database["public"]["Enums"]["brand"]
          collection: string | null
          created_at: string
          description: string | null
          id: number
          is_online: boolean | null
          name: string
          prestashop_id: number | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string | null
          url_image: string
        }
        Insert: {
          brand: Database["public"]["Enums"]["brand"]
          collection?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_online?: boolean | null
          name: string
          prestashop_id?: number | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
          url_image: string
        }
        Update: {
          brand?: Database["public"]["Enums"]["brand"]
          collection?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_online?: boolean | null
          name?: string
          prestashop_id?: number | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
          url_image?: string
        }
        Relationships: []
      }
      purchase: {
        Row: {
          airtable_id: string | null
          created_at: string
          date: string | null
          delivery_fees_ht: number
          delivery_fees_ttc: number
          id: number
          invoice: string | null
          payment_date_due: string | null
          reference: string | null
          status: string | null
          supplier_id: number | null
          tracking_link: string | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string
          date?: string | null
          delivery_fees_ht?: number
          delivery_fees_ttc?: number
          id?: number
          invoice?: string | null
          payment_date_due?: string | null
          reference?: string | null
          status?: string | null
          supplier_id?: number | null
          tracking_link?: string | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          created_at?: string
          date?: string | null
          delivery_fees_ht?: number
          delivery_fees_ttc?: number
          id?: number
          invoice?: string | null
          payment_date_due?: string | null
          reference?: string | null
          status?: string | null
          supplier_id?: number | null
          tracking_link?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_item: {
        Row: {
          airtable_id: string | null
          created_at: string
          current_status: Database["erp"]["Enums"]["purchase_item_status_enum"]
          deal_id: number | null
          id: string
          is_custom_wtb: boolean
          is_manual_stock_addition: boolean
          matching_history:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_item_id: number | null
          prevent_matching: boolean | null
          price_ht: number
          purchase_id: number | null
          state: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier_return_status: string | null
          updated_at: string | null
          variant_id: number
          vat_type: Database["public"]["Enums"]["tva_type"]
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string
          current_status?: Database["erp"]["Enums"]["purchase_item_status_enum"]
          deal_id?: number | null
          id?: string
          is_custom_wtb?: boolean
          is_manual_stock_addition?: boolean
          matching_history?:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_item_id?: number | null
          prevent_matching?: boolean | null
          price_ht?: number
          purchase_id?: number | null
          state?: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier_return_status?: string | null
          updated_at?: string | null
          variant_id: number
          vat_type: Database["public"]["Enums"]["tva_type"]
        }
        Update: {
          airtable_id?: string | null
          created_at?: string
          current_status?: Database["erp"]["Enums"]["purchase_item_status_enum"]
          deal_id?: number | null
          id?: string
          is_custom_wtb?: boolean
          is_manual_stock_addition?: boolean
          matching_history?:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_item_id?: number | null
          prevent_matching?: boolean | null
          price_ht?: number
          purchase_id?: number | null
          state?: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier_return_status?: string | null
          updated_at?: string | null
          variant_id?: number
          vat_type?: Database["public"]["Enums"]["tva_type"]
        }
        Relationships: [
          {
            foreignKeyName: "purchase_item_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "get_all_deals_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_differences"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_price_calculated"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      purchase_item_anomaly: {
        Row: {
          anomaly_details: string[]
          anomaly_type: string
          comment: string | null
          created_at: string
          id: number
          purchase_item_id: string
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          anomaly_details: string[]
          anomaly_type: string
          comment?: string | null
          created_at?: string
          id?: number
          purchase_item_id: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          anomaly_details?: string[]
          anomaly_type?: string
          comment?: string | null
          created_at?: string
          id?: number
          purchase_item_id?: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_item_anomaly_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "get_all_deals_with_details"
            referencedColumns: ["purchase_item_id"]
          },
          {
            foreignKeyName: "purchase_item_anomaly_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "hub_purchase_item_anomalies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_anomaly_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_anomaly_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_anomaly_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_item_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      reference: {
        Row: {
          brand: Database["public"]["Enums"]["brand"]
          collection: string | null
          color_success: boolean | null
          colors: Database["public"]["Enums"]["reference_color_enum"][] | null
          colorway: string | null
          created_at: string
          id: number
          is_online: boolean
          model: string | null
          name: string
          product_id: number | null
          release_date: string | null
          retailed: boolean
          similar_sku: string[] | null
          size_chart: Database["public"]["Enums"]["size_chart"] | null
          size_guide: string | null
          sizing: Database["public"]["Enums"]["sizing"] | null
          sku: string
          sx_product_id: string | null
          sx_slug: string | null
          title_fr: string | null
          updated_at: string | null
          url_image: string
          verified: boolean
        }
        Insert: {
          brand: Database["public"]["Enums"]["brand"]
          collection?: string | null
          color_success?: boolean | null
          colors?: Database["public"]["Enums"]["reference_color_enum"][] | null
          colorway?: string | null
          created_at?: string
          id?: number
          is_online?: boolean
          model?: string | null
          name: string
          product_id?: number | null
          release_date?: string | null
          retailed?: boolean
          similar_sku?: string[] | null
          size_chart?: Database["public"]["Enums"]["size_chart"] | null
          size_guide?: string | null
          sizing?: Database["public"]["Enums"]["sizing"] | null
          sku: string
          sx_product_id?: string | null
          sx_slug?: string | null
          title_fr?: string | null
          updated_at?: string | null
          url_image: string
          verified?: boolean
        }
        Update: {
          brand?: Database["public"]["Enums"]["brand"]
          collection?: string | null
          color_success?: boolean | null
          colors?: Database["public"]["Enums"]["reference_color_enum"][] | null
          colorway?: string | null
          created_at?: string
          id?: number
          is_online?: boolean
          model?: string | null
          name?: string
          product_id?: number | null
          release_date?: string | null
          retailed?: boolean
          similar_sku?: string[] | null
          size_chart?: Database["public"]["Enums"]["size_chart"] | null
          size_guide?: string | null
          sizing?: Database["public"]["Enums"]["sizing"] | null
          sku?: string
          sx_product_id?: string | null
          sx_slug?: string | null
          title_fr?: string | null
          updated_at?: string | null
          url_image?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reference_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      refund: {
        Row: {
          created_at: string
          current_status: string
          id: number
          limit_date: string | null
          shipping_fees_to_refund: number
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_status: string
          id?: number
          limit_date?: string | null
          shipping_fees_to_refund?: number
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_status?: string
          id?: number
          limit_date?: string | null
          shipping_fees_to_refund?: number
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refund_item: {
        Row: {
          amount: number | null
          created_at: string
          fees: number
          id: number
          order_item_id: number | null
          refund_id: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          fees?: number
          id?: number
          order_item_id?: number | null
          refund_id?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          fees?: number
          id?: number
          order_item_id?: number | null
          refund_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_item_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refund"
            referencedColumns: ["id"]
          },
        ]
      }
      return: {
        Row: {
          created_at: string
          date_limit_shipping: string | null
          id: number
          is_label_given: boolean | null
          parcel_id: string | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          date_limit_shipping?: string | null
          id?: number
          is_label_given?: boolean | null
          parcel_id?: string | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          date_limit_shipping?: string | null
          id?: number
          is_label_given?: boolean | null
          parcel_id?: string | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      return_item: {
        Row: {
          airtable_id: string | null
          created_at: string
          credit_amount: number
          current_status: Database["erp"]["Enums"]["return_item_status_enum"]
          fees: number
          id: number
          is_back_to_sender: boolean
          order_item_id: number
          reason: string
          reason_complement: string | null
          refund_amount: number
          refund_method: string | null
          return_id: number
          statuses:
            | Database["erp"]["CompositeTypes"]["return_item_status_type"][]
            | null
          updated_at: string | null
        }
        Insert: {
          airtable_id?: string | null
          created_at?: string
          credit_amount?: number
          current_status: Database["erp"]["Enums"]["return_item_status_enum"]
          fees?: number
          id?: number
          is_back_to_sender?: boolean
          order_item_id: number
          reason: string
          reason_complement?: string | null
          refund_amount?: number
          refund_method?: string | null
          return_id: number
          statuses?:
            | Database["erp"]["CompositeTypes"]["return_item_status_type"][]
            | null
          updated_at?: string | null
        }
        Update: {
          airtable_id?: string | null
          created_at?: string
          credit_amount?: number
          current_status?: Database["erp"]["Enums"]["return_item_status_enum"]
          fees?: number
          id?: number
          is_back_to_sender?: boolean
          order_item_id?: number
          reason?: string
          reason_complement?: string | null
          refund_amount?: number
          refund_method?: string | null
          return_id?: number
          statuses?:
            | Database["erp"]["CompositeTypes"]["return_item_status_type"][]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_has_order_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_item_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "return"
            referencedColumns: ["id"]
          },
        ]
      }
      return_item_anomaly: {
        Row: {
          anomaly_type: string
          comment: string | null
          created_at: string
          current_status: Database["public"]["Enums"]["anomaly_status_type"]
          id: number
          paid_at: string | null
          payment_link: string | null
          penalty_fees: string
          reasons: string[]
          return_item_id: number | null
          statuses:
            | Database["public"]["CompositeTypes"]["return_item_anomaly_status_enum_type"][]
            | null
          updated_at: string | null
        }
        Insert: {
          anomaly_type: string
          comment?: string | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["anomaly_status_type"]
          id?: number
          paid_at?: string | null
          payment_link?: string | null
          penalty_fees?: string
          reasons: string[]
          return_item_id?: number | null
          statuses?:
            | Database["public"]["CompositeTypes"]["return_item_anomaly_status_enum_type"][]
            | null
          updated_at?: string | null
        }
        Update: {
          anomaly_type?: string
          comment?: string | null
          created_at?: string
          current_status?: Database["public"]["Enums"]["anomaly_status_type"]
          id?: number
          paid_at?: string | null
          payment_link?: string | null
          penalty_fees?: string
          reasons?: string[]
          return_item_id?: number | null
          statuses?:
            | Database["public"]["CompositeTypes"]["return_item_anomaly_status_enum_type"][]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_anomaly_return_item_id_fkey"
            columns: ["return_item_id"]
            isOneToOne: true
            referencedRelation: "return_item"
            referencedColumns: ["id"]
          },
        ]
      }
      sav_ticket: {
        Row: {
          category: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          current_status:
            | Database["erp"]["Enums"]["sav_ticket_status_enum"]
            | null
          customer_id: number | null
          email_thread_id: string | null
          id: number
          order_id: number | null
          priority: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["sav_ticket_status_type"][]
            | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          current_status?:
            | Database["erp"]["Enums"]["sav_ticket_status_enum"]
            | null
          customer_id?: number | null
          email_thread_id?: string | null
          id?: number
          order_id?: number | null
          priority?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["sav_ticket_status_type"][]
            | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          current_status?:
            | Database["erp"]["Enums"]["sav_ticket_status_enum"]
            | null
          customer_id?: number | null
          email_thread_id?: string | null
          id?: number
          order_id?: number | null
          priority?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["sav_ticket_status_type"][]
            | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sav_ticket_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
        ]
      }
      sav_ticket_message: {
        Row: {
          created_at: string
          has_attachments: boolean
          id: number
          message: string | null
          sav_ticket_id: number | null
          type: Database["erp"]["Enums"]["sav_ticket_message_type_enum"] | null
        }
        Insert: {
          created_at?: string
          has_attachments?: boolean
          id?: number
          message?: string | null
          sav_ticket_id?: number | null
          type?: Database["erp"]["Enums"]["sav_ticket_message_type_enum"] | null
        }
        Update: {
          created_at?: string
          has_attachments?: boolean
          id?: number
          message?: string | null
          sav_ticket_id?: number | null
          type?: Database["erp"]["Enums"]["sav_ticket_message_type_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sav_ticket_message_sav_ticket_id_fkey"
            columns: ["sav_ticket_id"]
            isOneToOne: false
            referencedRelation: "sav_ticket"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_message_sav_ticket_id_fkey"
            columns: ["sav_ticket_id"]
            isOneToOne: false
            referencedRelation: "sav_ticket_with_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping: {
        Row: {
          created_at: string
          current_status:
            | Database["erp"]["Enums"]["shipping_status_enum"]
            | null
          id: number
          insurance: number | null
          parcel_id: string | null
          shipping_method: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_status?:
            | Database["erp"]["Enums"]["shipping_status_enum"]
            | null
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          shipping_method?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_status?:
            | Database["erp"]["Enums"]["shipping_status_enum"]
            | null
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          shipping_method?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_anomaly: {
        Row: {
          created_at: string
          id: number
          shipping_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          shipping_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          shipping_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_anomaly_shipping_id_fkey"
            columns: ["shipping_id"]
            isOneToOne: false
            referencedRelation: "shipping"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_anomaly_shipping_id_fkey"
            columns: ["shipping_id"]
            isOneToOne: false
            referencedRelation: "shipping_with_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier: {
        Row: {
          airtable_id: string | null
          country: string | null
          created_at: string
          hub_id: string | null
          id: number
          name: string
          siret: string | null
          type: Database["erp"]["Enums"]["supplier_type_enum"]
          updated_at: string | null
          vat_number: string | null
          website: string | null
        }
        Insert: {
          airtable_id?: string | null
          country?: string | null
          created_at?: string
          hub_id?: string | null
          id?: number
          name: string
          siret?: string | null
          type: Database["erp"]["Enums"]["supplier_type_enum"]
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          airtable_id?: string | null
          country?: string | null
          created_at?: string
          hub_id?: string | null
          id?: number
          name?: string
          siret?: string | null
          type?: Database["erp"]["Enums"]["supplier_type_enum"]
          updated_at?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      temp_size_chart: {
        Row: {
          chart: Json
          id: number
          name: Database["public"]["Enums"]["size_guide"]
          type: string
        }
        Insert: {
          chart: Json
          id?: number
          name: Database["public"]["Enums"]["size_guide"]
          type: string
        }
        Update: {
          chart?: Json
          id?: number
          name?: Database["public"]["Enums"]["size_guide"]
          type?: string
        }
        Relationships: []
      }
      variant: {
        Row: {
          ask_count_sx: number | null
          ask_price_sx: number | null
          bid_count_sx: number | null
          bid_price_sx: number | null
          created_at: string
          custom_wtb_price: number | null
          custom_wtb_price_timestamp: string | null
          custom_wtb_quantity: number
          ean_13: string | null
          id: number
          is_active: boolean
          is_consignable: boolean
          last_sale_date_sx: string | null
          last_sale_sx: number | null
          lowest_price_size: number
          overpriced: boolean | null
          price: number
          priceshape_price: number | null
          rarete: string | null
          reference_id: number
          retailed_repriced_at: string | null
          sales_count_sx_72: number | null
          size: string
          sx_variant_id: string | null
          updated_at: string | null
          wtb: boolean
          wtb_price: number | null
          wtb_quantity: number
        }
        Insert: {
          ask_count_sx?: number | null
          ask_price_sx?: number | null
          bid_count_sx?: number | null
          bid_price_sx?: number | null
          created_at?: string
          custom_wtb_price?: number | null
          custom_wtb_price_timestamp?: string | null
          custom_wtb_quantity?: number
          ean_13?: string | null
          id?: number
          is_active?: boolean
          is_consignable?: boolean
          last_sale_date_sx?: string | null
          last_sale_sx?: number | null
          lowest_price_size?: number
          overpriced?: boolean | null
          price?: number
          priceshape_price?: number | null
          rarete?: string | null
          reference_id: number
          retailed_repriced_at?: string | null
          sales_count_sx_72?: number | null
          size: string
          sx_variant_id?: string | null
          updated_at?: string | null
          wtb?: boolean
          wtb_price?: number | null
          wtb_quantity?: number
        }
        Update: {
          ask_count_sx?: number | null
          ask_price_sx?: number | null
          bid_count_sx?: number | null
          bid_price_sx?: number | null
          created_at?: string
          custom_wtb_price?: number | null
          custom_wtb_price_timestamp?: string | null
          custom_wtb_quantity?: number
          ean_13?: string | null
          id?: number
          is_active?: boolean
          is_consignable?: boolean
          last_sale_date_sx?: string | null
          last_sale_sx?: number | null
          lowest_price_size?: number
          overpriced?: boolean | null
          price?: number
          priceshape_price?: number | null
          rarete?: string | null
          reference_id?: number
          retailed_repriced_at?: string | null
          sales_count_sx_72?: number | null
          size?: string
          sx_variant_id?: string | null
          updated_at?: string | null
          wtb?: boolean
          wtb_price?: number | null
          wtb_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bank_recipients: {
        Row: {
          email: string | null
          iban: string | null
          id: number | null
          name: string | null
          profile_id: string | null
          qonto_beneficiary_id: string | null
          qonto_imported: boolean | null
          qonto_trusted: boolean | null
        }
        Relationships: []
      }
      get_all_deals_with_details: {
        Row: {
          address: string | null
          address_country: string | null
          address_id: number | null
          anomaly: Json | null
          authentified_at: string | null
          bic: string | null
          cancelled_at: string | null
          city: string | null
          complement: string | null
          created_at: string | null
          devise: string | null
          fees: number | null
          first_name: string | null
          id: number | null
          last_name: string | null
          order_item_id: number | null
          payed_at: string | null
          payment_account: string | null
          payment_country: string | null
          payment_type: Database["public"]["Enums"]["payment_type"] | null
          phone: string | null
          price: number | null
          profile_id: string | null
          purchase_item_id: string | null
          received_at: string | null
          returned_at: string | null
          returned_reason: string | null
          shipping: Json | null
          shipping_in_id: number | null
          status: string | null
          updated_at: string | null
          variant: Json | null
          variant_id: number | null
          vat: Database["public"]["Enums"]["tva_type"] | null
          view_at: string | null
          zipcode: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "bank_recipients"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_differences"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_price_calculated"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_purchase_item_anomalies: {
        Row: {
          anomaly_current_status:
            | Database["public"]["Enums"]["anomaly_status_type"]
            | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["purchase_item_status_enum"]
            | null
          deal: Json | null
          deal_anomaly: Json | null
          deal_id: number | null
          email: string | null
          id: string | null
          is_custom_wtb: boolean | null
          is_manual_stock_addition: boolean | null
          order_item_id: number | null
          prevent_matching: boolean | null
          price_ht: number | null
          purchase_id: number | null
          purchase_item_anomaly: Json | null
          purchase_reference: string | null
          reference: Json | null
          size: string | null
          state: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier_id: number | null
          updated_at: string | null
          variant_id: number | null
          vat_type: Database["public"]["Enums"]["tva_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_item_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "get_all_deals_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_differences"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_price_calculated"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_accounting: {
        Row: {
          ca_marge_ttc: number | null
          ca_normal_ttc: number | null
          country: string | null
          marge_marge_ttc: number | null
          marge_normal_ttc: number | null
          order_id: number | null
          order_item_id: number | null
          shipped_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
        ]
      }
      order_item_analysis: {
        Row: {
          chiffre_affaire_ttc: number | null
          marge_ht: number | null
          marge_ttc: number | null
          order_date: string | null
          order_id: number | null
          order_item_id: number | null
          volume_affaire_ttc: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
        ]
      }
      order_item_analysis_monthly: {
        Row: {
          ca_accessoire_b2c: number | null
          ca_collector_b2c: number | null
          ca_lifestyle_b2c: number | null
          ca_nettoyage_b2c: number | null
          ca_sneakers_b2c: number | null
          ca_vetement_b2c: number | null
          chiffre_affaire_b2b: number | null
          chiffre_affaire_b2c: number | null
          count_order: number | null
          count_order_item: number | null
          count_order_item_b2b: number | null
          count_order_item_b2c: number | null
          marge_ht_accessoire_b2c: number | null
          marge_ht_b2b: number | null
          marge_ht_b2c: number | null
          marge_ht_collector_b2c: number | null
          marge_ht_lifestyle_b2c: number | null
          marge_ht_nettoyage_b2c: number | null
          marge_ht_sneakers_b2c: number | null
          marge_ht_vetement_b2c: number | null
          month_year: string | null
          nb_accessoire_b2c: number | null
          nb_collector_b2c: number | null
          nb_lifestyle_b2c: number | null
          nb_nettoyage_b2c: number | null
          nb_nouveaux_vendeurs: number | null
          nb_sneakers_b2c: number | null
          nb_vendeurs_partenaires: number | null
          nb_vetement_b2c: number | null
          perte_anomalie_ht: number | null
          taux_annulation_b2c: number | null
          taux_repeat_client: number | null
          taux_retour_b2c: number | null
          total_chiffre_affaire_ttc: number | null
          total_marge_ht: number | null
          total_marge_ttc: number | null
          total_volume_affaire_ttc: number | null
        }
        Relationships: []
      }
      order_item_analysis_weekly: {
        Row: {
          ca_accessoire_b2c: number | null
          ca_collector_b2c: number | null
          ca_lifestyle_b2c: number | null
          ca_nettoyage_b2c: number | null
          ca_sneakers_b2c: number | null
          ca_vetement_b2c: number | null
          chiffre_affaire_b2b: number | null
          chiffre_affaire_b2c: number | null
          count_order: number | null
          count_order_item: number | null
          count_order_item_b2b: number | null
          count_order_item_b2c: number | null
          marge_ht_accessoire_b2c: number | null
          marge_ht_b2b: number | null
          marge_ht_b2c: number | null
          marge_ht_collector_b2c: number | null
          marge_ht_lifestyle_b2c: number | null
          marge_ht_nettoyage_b2c: number | null
          marge_ht_sneakers_b2c: number | null
          marge_ht_vetement_b2c: number | null
          nb_accessoire_b2c: number | null
          nb_collector_b2c: number | null
          nb_lifestyle_b2c: number | null
          nb_nettoyage_b2c: number | null
          nb_nouveaux_vendeurs: number | null
          nb_sneakers_b2c: number | null
          nb_vendeurs_partenaires: number | null
          nb_vetement_b2c: number | null
          perte_anomalie_ht: number | null
          taux_annulation_b2b: number | null
          taux_annulation_b2c: number | null
          taux_repeat_client: number | null
          taux_retour_b2b: number | null
          taux_retour_b2c: number | null
          total_chiffre_affaire_ttc: number | null
          total_marge_ht: number | null
          total_marge_ttc: number | null
          total_volume_affaire_ttc: number | null
          week_begin_date: string | null
          week_end_date: string | null
          week_year: string | null
        }
        Relationships: []
      }
      order_item_discount: {
        Row: {
          av_discount_amount_ttc: number | null
          discount_amount_ttc: number | null
          id: number | null
          nb_items: number | null
          order_id: number | null
          order_total_items_price_ttc: number | null
        }
        Relationships: []
      }
      order_item_estimated_shipping_date: {
        Row: {
          id: number | null
          shipping_estimation: Json | null
        }
        Relationships: []
      }
      order_item_matchable: {
        Row: {
          comment: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["order_item_status_enum"]
            | null
          discounted_price_ttc: number | null
          estimated_delivery_max: string | null
          estimated_delivery_min: string | null
          exact_sku: string | null
          full_price_ttc: number | null
          id: number | null
          order_date: string | null
          order_id: number | null
          prevent_matching: boolean | null
          prevent_wtb: boolean | null
          product_id: number | null
          size: string | null
          state: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          variant_id: number | null
          vat_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_item_monitoring: {
        Row: {
          comment: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["order_item_status_enum"]
            | null
          discount_amount_ttc: number | null
          discounted_price_ttc: number | null
          estimated_delivery_max: string | null
          estimated_delivery_min: string | null
          exact_sku: string | null
          full_price_ttc: number | null
          id: number | null
          order: Json | null
          order_id: number | null
          prevent_matching: boolean | null
          product: Json | null
          product_id: number | null
          purchase_item: Json | null
          size: string | null
          state: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at: string | null
          vat_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_item_wtb: {
        Row: {
          airtable_id: string | null
          cancelled_reason: string | null
          cancelled_reason_custom: string | null
          comment: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["order_item_status_enum"]
            | null
          custom_wtb_price: number | null
          custom_wtb_price_timestamp: string | null
          discount_amount_ttc: number | null
          discounted_price_ttc: number | null
          estimated_delivery_max: string | null
          estimated_delivery_min: string | null
          exact_sku: string | null
          full_price_ttc: number | null
          id: number | null
          matching_history:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          nb_items: number | null
          order_date: string | null
          order_id: number | null
          order_total_items_price_ttc: number | null
          prevent_matching: boolean | null
          prevent_wtb: boolean | null
          product_id: number | null
          rarity: string | null
          size: string | null
          size_charts: Database["public"]["Enums"]["size_chart"][] | null
          size_guides: string[] | null
          skus: string[] | null
          slugs: string[] | null
          state: string | null
          state_updated_at: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at: string | null
          variant_ids: number[] | null
          vat_amount: number | null
          wtb_prices: number[] | null
          wtb_quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_items_for_variant: {
        Row: {
          comment: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["order_item_status_enum"]
            | null
          discount_amount_ttc: number | null
          discounted_price_ttc: number | null
          estimated_delivery_max: string | null
          estimated_delivery_min: string | null
          exact_sku: string | null
          full_price_ttc: number | null
          id: number | null
          nb_items: number | null
          order_date: string | null
          order_id: number | null
          order_total_items_price_ttc: number | null
          prevent_matching: boolean | null
          product_id: number | null
          size: string | null
          state: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["order_item_status_type"][]
            | null
          updated_at: string | null
          variant_id: number | null
          vat_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_with_all_details: {
        Row: {
          address: Json | null
          address_delivery_id: number | null
          created_at: string | null
          customer: Json | null
          customer_email: string | null
          customer_id: number | null
          customer_prestashop_id: number | null
          date: string | null
          has_active_return_anomaly: boolean | null
          has_active_return_authentication: boolean | null
          has_active_return_reception: boolean | null
          has_active_return_to_refund: boolean | null
          has_returned_or_cancelled_items: boolean | null
          id: number | null
          language: string | null
          order_id: number | null
          order_id_source: string | null
          order_item_count: number | null
          order_items: Json | null
          order_reference_source: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          shipped_count: number | null
          shipping_fees_ttc: number | null
          shipping_method: string | null
          shipping_status: string | null
          source: string | null
          to_ship_count: number | null
          total_items: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_address_delivery_id_fkey"
            columns: ["address_delivery_id"]
            isOneToOne: false
            referencedRelation: "address_delivery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      order_with_return_details: {
        Row: {
          address: Json | null
          address_delivery_id: number | null
          created_at: string | null
          customer: Json | null
          customer_email: string | null
          customer_id: number | null
          customer_prestashop_id: number | null
          date: string | null
          has_active_return_anomaly: boolean | null
          has_active_return_authentication: boolean | null
          has_active_return_reception: boolean | null
          has_active_return_to_refund: boolean | null
          has_returned_or_cancelled_items: boolean | null
          has_to_receive_back_to_sender: boolean | null
          id: number | null
          language: string | null
          order_id_source: string | null
          order_items: Json | null
          order_reference_source: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          shipping_fees_ttc: number | null
          shipping_method: string | null
          source: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_address_delivery_id_fkey"
            columns: ["address_delivery_id"]
            isOneToOne: false
            referencedRelation: "address_delivery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      order_with_status_detailed: {
        Row: {
          address: Json | null
          address_delivery_id: number | null
          cancelled_count: number | null
          created_at: string | null
          customer: Json | null
          customer_id: number | null
          date: string | null
          id: number | null
          language: string | null
          order_id: number | null
          order_id_source: string | null
          order_item_count: number | null
          order_items: Json | null
          order_reference_source: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          returned_count: number | null
          shipped_count: number | null
          shipping_fees_ttc: number | null
          shipping_method: string | null
          shipping_status: string | null
          source: string | null
          to_ship_count: number | null
          total_items: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_address_delivery_id_fkey"
            columns: ["address_delivery_id"]
            isOneToOne: false
            referencedRelation: "address_delivery"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_item_matchable: {
        Row: {
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["purchase_item_status_enum"]
            | null
          id: string | null
          order_item_id: number | null
          prevent_matching: boolean | null
          price_ht: number | null
          price_ttc: number | null
          purchase_id: number | null
          state: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          variant_id: number | null
          vat_type: Database["public"]["Enums"]["tva_type"] | null
        }
        Insert: {
          created_at?: string | null
          current_status?:
            | Database["erp"]["Enums"]["purchase_item_status_enum"]
            | null
          id?: string | null
          order_item_id?: number | null
          prevent_matching?: boolean | null
          price_ht?: number | null
          price_ttc?: never
          purchase_id?: number | null
          state?: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          variant_id?: number | null
          vat_type?: Database["public"]["Enums"]["tva_type"] | null
        }
        Update: {
          created_at?: string | null
          current_status?:
            | Database["erp"]["Enums"]["purchase_item_status_enum"]
            | null
          id?: string | null
          order_item_id?: number | null
          prevent_matching?: boolean | null
          price_ht?: number | null
          price_ttc?: never
          purchase_id?: number | null
          state?: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          variant_id?: number | null
          vat_type?: Database["public"]["Enums"]["tva_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_differences"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_price_calculated"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      purchase_item_with_details: {
        Row: {
          airtable_id: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["purchase_item_status_enum"]
            | null
          deal: Json | null
          deal_id: number | null
          id: string | null
          is_custom_wtb: boolean | null
          is_manual_stock_addition: boolean | null
          matching_history:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_id: number | null
          order_item_id: number | null
          prevent_matching: boolean | null
          price_ht: number | null
          product_type: Database["public"]["Enums"]["product_type"] | null
          purchase: Json | null
          purchase_id: number | null
          reference: Json | null
          shipping: Json | null
          size: string | null
          state: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier: Json | null
          updated_at: string | null
          variant_id: number | null
          vat_type: Database["public"]["Enums"]["tva_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "purchase_item_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "get_all_deals_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_accounting"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_analysis"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_estimated_shipping_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_item_wtb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchase_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_item_matchable"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "order_items_for_variant"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "stock_per_variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_differences"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "purchase_item_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variant_wtb_price_calculated"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      purchase_with_details: {
        Row: {
          airtable_id: string | null
          created_at: string | null
          date: string | null
          delivery_fees_ht: number | null
          delivery_fees_ttc: number | null
          id: number | null
          invoice: string | null
          payment_date_due: string | null
          purchase_item_count: number | null
          purchase_items: Json | null
          purchase_status: string | null
          reference: string | null
          shipping: Json | null
          status: string | null
          supplier: Database["erp"]["Tables"]["supplier"]["Row"] | null
          supplier_id: number | null
          total_price_ht: number | null
          total_price_ttc: number | null
          tracking_link: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
        ]
      }
      sav_ticket_with_infos: {
        Row: {
          category: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["sav_ticket_status_enum"]
            | null
          customer: Json | null
          customer_id: number | null
          email_thread_id: string | null
          id: number | null
          messages: Json | null
          order: Json | null
          order_id: number | null
          priority: string | null
          related_tickets: Json | null
          statuses:
            | Database["erp"]["CompositeTypes"]["sav_ticket_status_type"][]
            | null
          subject: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sav_ticket_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_item_discount"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_all_details"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_return_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sav_ticket_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_with_status_detailed"
            referencedColumns: ["order_id"]
          },
        ]
      }
      shipping_with_order_items: {
        Row: {
          address_delivery: Json | null
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["shipping_status_enum"]
            | null
          customer: Json | null
          id: number | null
          insurance: number | null
          nb_item: number | null
          order: Json | null
          order_items: Json | null
          parcel_id: string | null
          shipping_method: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      stock_per_variant: {
        Row: {
          ask_count_sx: number | null
          ask_price_sx: number | null
          bid_count_sx: number | null
          bid_price_sx: number | null
          brand: Database["public"]["Enums"]["brand"] | null
          created_at: string | null
          custom_wtb_price: number | null
          custom_wtb_price_timestamp: string | null
          custom_wtb_quantity: number | null
          ean_13: string | null
          id: number | null
          is_active: boolean | null
          is_consignable: boolean | null
          last_3_purchases: Json | null
          last_sale_date_sx: string | null
          last_sale_sx: number | null
          lowest_price_size: number | null
          name: string | null
          oldest_price_ht: number | null
          oldest_purchase_date: string | null
          overpriced: boolean | null
          price: number | null
          priceshape_price: number | null
          product_id: number | null
          quantity: number | null
          rarete: string | null
          reference_id: number | null
          retailed_repriced_at: string | null
          sales_count_sx_72: number | null
          size: string | null
          size_chart: Database["public"]["Enums"]["size_chart"] | null
          sku: string | null
          sx_variant_id: string | null
          type: Database["public"]["Enums"]["product_type"] | null
          updated_at: string | null
          url_image: string | null
          wtb: boolean | null
          wtb_price: number | null
          wtb_quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_wtb_differences: {
        Row: {
          actual_wtb: boolean | null
          actual_wtb_quantity: number | null
          expected_wtb: boolean | null
          expected_wtb_quantity: number | null
          updated_at: string | null
          variant_id: number | null
        }
        Relationships: []
      }
      variant_wtb_price_calculated: {
        Row: {
          variant_id: number | null
          wtb_price_calculated: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      batch_import_qonto_beneficiaries: {
        Args: { updates: Json }
        Returns: undefined
      }
      create_back_to_sender_transaction: {
        Args: {
          p_customer_id: number
          p_shipping_id: number
          p_refund_option: string
          p_caller_is_admin: boolean
          p_return_fees: number
        }
        Returns: undefined
      }
      create_return_and_cancel_transaction: {
        Args: {
          p_customer_id: number
          p_return: Json
          p_submissions: Json
          p_shipping_fees_to_refund: number
          p_bypass_security?: boolean
        }
        Returns: string
      }
      create_return_anomaly: {
        Args: { p_anomaly_details: Json; p_return_item_id: number }
        Returns: number
      }
      create_shipping_order: {
        Args: {
          p_order_item_ids: number[]
          p_order_id: number
          p_tracking_number: string
          p_shipping_method: string
          p_tracking_link: string
          p_parcel_id: string
          p_insurance: number
          p_current_status?: string
        }
        Returns: boolean
      }
      csv_orders_import: {
        Args: { orders: Json }
        Returns: {
          success_order_ids: number[]
          error_orders: Json[]
        }[]
      }
      execute_distinct_request: {
        Args: { p_request: string }
        Returns: {
          value: string
          count: number
        }[]
      }
      find_similar_orders: {
        Args: { reference_order_id: number }
        Returns: {
          similar_order_id: number
        }[]
      }
      fix_wtb_quantity: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_all_purchase_items_by_current_status: {
        Args: { allowed_purchase_item_status: string[] }
        Returns: {
          airtable_id: string | null
          created_at: string
          current_status: Database["erp"]["Enums"]["purchase_item_status_enum"]
          deal_id: number | null
          id: string
          is_custom_wtb: boolean
          is_manual_stock_addition: boolean
          matching_history:
            | Database["erp"]["CompositeTypes"]["matching_history_type"][]
            | null
          order_item_id: number | null
          prevent_matching: boolean | null
          price_ht: number
          purchase_id: number | null
          state: Database["erp"]["Enums"]["purchase_item_state_enum"] | null
          statuses:
            | Database["erp"]["CompositeTypes"]["purchase_item_status_type"][]
            | null
          supplier_return_status: string | null
          updated_at: string | null
          variant_id: number
          vat_type: Database["public"]["Enums"]["tva_type"]
        }[]
      }
      get_importable_profiles: {
        Args: { search_text: string }
        Returns: {
          id: string
          first_name: string
          last_name: string
          email: string
          vat_number: string
          siret: string
          country: string
        }[]
      }
      get_purchase_items_by_current_status: {
        Args: { allowed_purchase_item_status: string[] }
        Returns: {
          id: string
          price_ttc: number
          variant_id: number
          current_status: Database["erp"]["Enums"]["purchase_item_status_enumold"]
          state: Database["erp"]["Enums"]["purchase_item_state_enum"]
          order_item_id: number
        }[]
      }
      get_purchase_items_ids_by_current_status: {
        Args: { allowed_purchase_item_status: string[] }
        Returns: string[]
      }
      get_variants_for_order_item: {
        Args: { p_order_item_id: number }
        Returns: {
          variant_id: number
          size: string
          sku: string
        }[]
      }
      insert_deals_for_supplier: {
        Args: {
          p_date: string
          p_supplier_id: number
          p_hub_id: string
          p_purchase_items: Json[]
          p_no_fees: boolean
          p_no_shipping_fees: boolean
        }
        Returns: number[]
      }
      insert_order_items: {
        Args: { order_items: Json[] }
        Returns: undefined
      }
      insert_order_items_from_airtable_json: {
        Args: { input_data: Json }
        Returns: Json
      }
      prevent_duplicate_shippings: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      update_order_item_status_based_on_purchase_item: {
        Args: {
          p_order_item_id: number
          p_purchase_status: Database["erp"]["Enums"]["purchase_item_status_enum"]
        }
        Returns: undefined
      }
      update_order_items_processing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_variants_prices_from_sx: {
        Args: { variants: Json }
        Returns: {
          success_ids: number[]
          error_list: Json[]
        }[]
      }
      update_wtb_prices_from_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_wtb_prices_from_view_by_id: {
        Args: { p_id: number }
        Returns: undefined
      }
    }
    Enums: {
      order_item_status_enum:
        | "to_confirm"
        | "order_confirmed"
        | "processing"
        | "purchase_on_the_way"
        | "authentication"
        | "to_ship"
        | "shipped"
        | "cancelled"
        | "returned"
      order_item_status_enumold:
        | "order_confirmed"
        | "in_preparation"
        | "processing"
        | "purchase_on_the_way"
        | "authentication"
        | "shipped"
        | "to_ship"
        | "to_confirm"
      purchase_item_state_enum: "new" | "damaged_box" | "replacement_box"
      purchase_item_status_enum:
        | "supplier_ship"
        | "reception"
        | "authentication"
        | "in_stock"
        | "shipped"
        | "to_cancel"
        | "cancelled"
        | "anomaly"
      purchase_item_status_enumold:
        | "reception"
        | "authentication"
        | "in_stock"
        | "to_cancel"
        | "cancelled"
        | "lost"
        | "reserved"
        | "gift"
        | "to_ship"
        | "supplier_ship"
        | "shipped"
      return_item_status_enum:
        | "pending"
        | "announced"
        | "refunded"
        | "cancelled"
        | "to_verify"
        | "to_ship"
        | "reception"
        | "to_refund"
        | "anomaly"
      sav_ticket_message_type_enum: "agent" | "customer" | "internal"
      sav_ticket_status_enum:
        | "open"
        | "closed"
        | "waiting_customer"
        | "waiting_third_party"
        | "in_progress"
        | "resolved"
      shipping_status_enum:
        | "pending"
        | "announced"
        | "delivered"
        | "back_to_sender"
        | "on_the_way"
        | "at_service_point"
        | "cancelled"
      supplier_type_enum: "retailer" | "marketplace" | "hub"
    }
    CompositeTypes: {
      matching_history_type: {
        status: string | null
        timestamp: string | null
        matching_id: string | null
      }
      order_item_status_type: {
        status: Database["erp"]["Enums"]["order_item_status_enum"] | null
        timestamp: string | null
      }
      purchase_item_status_type: {
        status: Database["erp"]["Enums"]["purchase_item_status_enum"] | null
        timestamp: string | null
      }
      return_item_status_type: {
        status: Database["erp"]["Enums"]["return_item_status_enum"] | null
        timestamp: string | null
      }
      sav_ticket_status_type: {
        status: Database["erp"]["Enums"]["sav_ticket_status_enum"] | null
        timestamp: string | null
      }
      shipping_status_enum_type: {
        status: Database["erp"]["Enums"]["shipping_status_enum"] | null
        timestamp: string | null
      }
      shipping_status_type: {
        status: Database["erp"]["Enums"]["shipping_status_enum"] | null
        timestamp: string | null
      }
    }
  }
  public: {
    Tables: {
      address: {
        Row: {
          address: string
          city: string
          complement: string | null
          country_id: number
          created_at: string
          first_name: string
          id: number
          is_favorite: boolean
          last_name: string
          phone: string
          profile_id: string
          title: string
          updated_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          complement?: string | null
          country_id: number
          created_at?: string
          first_name: string
          id?: number
          is_favorite?: boolean
          last_name: string
          phone: string
          profile_id?: string
          title: string
          updated_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string | null
          country_id?: number
          created_at?: string
          first_name?: string
          id?: number
          is_favorite?: boolean
          last_name?: string
          phone?: string
          profile_id?: string
          title?: string
          updated_at?: string | null
          zipcode?: string
        }
        Relationships: [
          {
            foreignKeyName: "address_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "address_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bid: {
        Row: {
          auto_buy: number | null
          closed_at: string | null
          created_at: string
          duration: number
          finished_price: number | null
          id: number
          max: number
          min: number
          offer_min_diff: number
          started_at: string
          started_price: number
          updated_at: string
          variant_id: number
        }
        Insert: {
          auto_buy?: number | null
          closed_at?: string | null
          created_at?: string
          duration?: number
          finished_price?: number | null
          id?: number
          max: number
          min: number
          offer_min_diff?: number
          started_at?: string
          started_price: number
          updated_at: string
          variant_id: number
        }
        Update: {
          auto_buy?: number | null
          closed_at?: string | null
          created_at?: string
          duration?: number
          finished_price?: number | null
          id?: number
          max?: number
          min?: number
          offer_min_diff?: number
          started_at?: string
          started_price?: number
          updated_at?: string
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bid_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "detailed_listings_view"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "bid_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "last_and_best_prices_by_reference_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      bid_offer: {
        Row: {
          bid_id: number
          created_at: string
          id: number
          price: number
          profile_id: string
          status: number
          updated_at: string | null
        }
        Insert: {
          bid_id: number
          created_at?: string
          id?: number
          price: number
          profile_id?: string
          status?: number
          updated_at?: string | null
        }
        Update: {
          bid_id?: number
          created_at?: string
          id?: number
          price?: number
          profile_id?: string
          status?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_offer_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bid"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_offer_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      consign: {
        Row: {
          created_at: string
          duration: number
          id: number
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          duration?: number
          id?: number
          profile_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          duration?: number
          id?: number
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consigne_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      country: {
        Row: {
          continent: Database["public"]["Enums"]["continents_type"] | null
          created_at: string
          id: number
          is_active: boolean
          iso2: string
          iso3: string | null
          local_name: string | null
          name: string
          name_fr: string
          updated_at: string | null
          vat: number | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents_type"] | null
          created_at?: string
          id?: number
          is_active?: boolean
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name: string
          name_fr: string
          updated_at?: string | null
          vat?: number | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents_type"] | null
          created_at?: string
          id?: number
          is_active?: boolean
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name?: string
          name_fr?: string
          updated_at?: string | null
          vat?: number | null
        }
        Relationships: []
      }
      deal: {
        Row: {
          address: string
          address_country: string
          address_id: number | null
          airtable_id: string | null
          authentified_at: string | null
          bic: string | null
          cancelled_at: string | null
          city: string
          complement: string | null
          created_at: string
          devise: string
          email_send:
            | Database["public"]["CompositeTypes"]["email_send_enum_type"][]
            | null
          fees: number
          first_name: string
          id: number
          is_manual_stock_addition: boolean
          last_name: string
          no_fees: boolean
          no_shipping_fees: boolean
          order_item_id: number | null
          payed_at: string | null
          payment_account: string
          payment_country: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          phone: string
          price: number
          profile_id: string
          purchase_item_current_status: string | null
          received_at: string | null
          returned_at: string | null
          returned_reason: string | null
          shipping_in_id: number | null
          status: string
          updated_at: string | null
          variant_id: number
          vat: Database["public"]["Enums"]["tva_type"]
          view_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          address_country: string
          address_id?: number | null
          airtable_id?: string | null
          authentified_at?: string | null
          bic?: string | null
          cancelled_at?: string | null
          city: string
          complement?: string | null
          created_at?: string
          devise?: string
          email_send?:
            | Database["public"]["CompositeTypes"]["email_send_enum_type"][]
            | null
          fees?: number
          first_name: string
          id?: number
          is_manual_stock_addition?: boolean
          last_name: string
          no_fees?: boolean
          no_shipping_fees?: boolean
          order_item_id?: number | null
          payed_at?: string | null
          payment_account: string
          payment_country?: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          phone: string
          price: number
          profile_id?: string
          purchase_item_current_status?: string | null
          received_at?: string | null
          returned_at?: string | null
          returned_reason?: string | null
          shipping_in_id?: number | null
          status?: string
          updated_at?: string | null
          variant_id: number
          vat: Database["public"]["Enums"]["tva_type"]
          view_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          address_country?: string
          address_id?: number | null
          airtable_id?: string | null
          authentified_at?: string | null
          bic?: string | null
          cancelled_at?: string | null
          city?: string
          complement?: string | null
          created_at?: string
          devise?: string
          email_send?:
            | Database["public"]["CompositeTypes"]["email_send_enum_type"][]
            | null
          fees?: number
          first_name?: string
          id?: number
          is_manual_stock_addition?: boolean
          last_name?: string
          no_fees?: boolean
          no_shipping_fees?: boolean
          order_item_id?: number | null
          payed_at?: string | null
          payment_account?: string
          payment_country?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          phone?: string
          price?: number
          profile_id?: string
          purchase_item_current_status?: string | null
          received_at?: string | null
          returned_at?: string | null
          returned_reason?: string | null
          shipping_in_id?: number | null
          status?: string
          updated_at?: string | null
          variant_id?: number
          vat?: Database["public"]["Enums"]["tva_type"]
          view_at?: string | null
          zipcode?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_shipping_in_id_fkey"
            columns: ["shipping_in_id"]
            isOneToOne: false
            referencedRelation: "shipping_in"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_shipping_in_id_fkey"
            columns: ["shipping_in_id"]
            isOneToOne: false
            referencedRelation: "shipping_in_with_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "detailed_listings_view"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "last_and_best_prices_by_reference_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      deal_anomaly: {
        Row: {
          anomaly_details: string[] | null
          anomaly_type: string
          created_at: string
          current_status: Database["public"]["Enums"]["anomaly_status_type"]
          deal_id: number
          fees: number
          id: number
          insurance: number | null
          parcel_id: string | null
          payed_at: string | null
          payment_link: string | null
          purchase_item_id: string
          shipping_method: string | null
          statuses:
            | Database["public"]["CompositeTypes"]["shipping_anomaly_status_enum_type"][]
            | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          anomaly_details?: string[] | null
          anomaly_type: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["anomaly_status_type"]
          deal_id: number
          fees?: number
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          payed_at?: string | null
          payment_link?: string | null
          purchase_item_id: string
          shipping_method?: string | null
          statuses?:
            | Database["public"]["CompositeTypes"]["shipping_anomaly_status_enum_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          anomaly_details?: string[] | null
          anomaly_type?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["anomaly_status_type"]
          deal_id?: number
          fees?: number
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          payed_at?: string | null
          payment_link?: string | null
          purchase_item_id?: string
          shipping_method?: string | null
          statuses?:
            | Database["public"]["CompositeTypes"]["shipping_anomaly_status_enum_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_anomaly_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_anomaly_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: true
            referencedRelation: "deal_with_variant_reference_view"
            referencedColumns: ["id"]
          },
        ]
      }
      email_config: {
        Row: {
          created_at: string
          description: string | null
          details: string | null
          devmode: boolean
          id: number
          key: string
          last_send_at: string | null
          n8n_endpoint: string
          n8n_event: string
          n8n_link: string | null
          n8n_name: string
          nb_send: number
          status: boolean
          triggers: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          details?: string | null
          devmode?: boolean
          id?: number
          key: string
          last_send_at?: string | null
          n8n_endpoint: string
          n8n_event: string
          n8n_link?: string | null
          n8n_name: string
          nb_send?: number
          status?: boolean
          triggers?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          details?: string | null
          devmode?: boolean
          id?: number
          key?: string
          last_send_at?: string | null
          n8n_endpoint?: string
          n8n_event?: string
          n8n_link?: string | null
          n8n_name?: string
          nb_send?: number
          status?: boolean
          triggers?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      incorporation_address: {
        Row: {
          address: string
          city: string
          complement: string | null
          country: string
          created_at: string
          id: number
          pro_infos_id: number
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          complement?: string | null
          country: string
          created_at?: string
          id?: number
          pro_infos_id: number
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          id?: number
          pro_infos_id?: number
          zipcode?: string
        }
        Relationships: [
          {
            foreignKeyName: "incorporation_address_pro_infos_id_fkey"
            columns: ["pro_infos_id"]
            isOneToOne: true
            referencedRelation: "pro_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      listing: {
        Row: {
          created_at: string
          duration: number
          expires_at: string
          id: number
          is_active: boolean
          price: number
          profile_id: string
          refreshed_at: string
          updated_at: string | null
          variant_id: number | null
          vat: Database["public"]["Enums"]["tva_type"]
        }
        Insert: {
          created_at?: string
          duration?: number
          expires_at: string
          id?: number
          is_active?: boolean
          price: number
          profile_id?: string
          refreshed_at?: string
          updated_at?: string | null
          variant_id?: number | null
          vat?: Database["public"]["Enums"]["tva_type"]
        }
        Update: {
          created_at?: string
          duration?: number
          expires_at?: string
          id?: number
          is_active?: boolean
          price?: number
          profile_id?: string
          refreshed_at?: string
          updated_at?: string | null
          variant_id?: number | null
          vat?: Database["public"]["Enums"]["tva_type"]
        }
        Relationships: [
          {
            foreignKeyName: "listing_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "detailed_listings_view"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "listing_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "last_and_best_prices_by_reference_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      offer: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          listing_id: number
          price: number
          profile_id: string
          replied_at: string | null
          status: Database["public"]["Enums"]["offer_status_type"]
          updated_at: string | null
          view_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          listing_id: number
          price: number
          profile_id: string
          replied_at?: string | null
          status?: Database["public"]["Enums"]["offer_status_type"]
          updated_at?: string | null
          view_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          listing_id?: number
          price?: number
          profile_id?: string
          replied_at?: string | null
          status?: Database["public"]["Enums"]["offer_status_type"]
          updated_at?: string | null
          view_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "detailed_listings_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "offer_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_method: {
        Row: {
          bic: string | null
          country_id: number | null
          created_at: string
          custom_name: string
          devise: string
          email: string | null
          iban: string | null
          id: number
          is_favorite: boolean
          profile_id: string
          qonto_beneficiary_id: string | null
          qonto_imported: boolean
          qonto_trusted: boolean
          type: Database["public"]["Enums"]["payment_type"]
          updated_at: string | null
        }
        Insert: {
          bic?: string | null
          country_id?: number | null
          created_at?: string
          custom_name: string
          devise?: string
          email?: string | null
          iban?: string | null
          id?: number
          is_favorite?: boolean
          profile_id?: string
          qonto_beneficiary_id?: string | null
          qonto_imported?: boolean
          qonto_trusted?: boolean
          type: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Update: {
          bic?: string | null
          country_id?: number | null
          created_at?: string
          custom_name?: string
          devise?: string
          email?: string | null
          iban?: string | null
          id?: number
          is_favorite?: boolean
          profile_id?: string
          qonto_beneficiary_id?: string | null
          qonto_imported?: boolean
          qonto_trusted?: boolean
          type?: Database["public"]["Enums"]["payment_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_method_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_method_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_infos: {
        Row: {
          apply_vat: boolean
          commercial_name: string
          company_name: string
          created_at: string
          id: number
          kbis_send: string | null
          kbis_verified:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          kbis_verified_at: string | null
          profile_id: string
          rib_send: string | null
          rib_verified:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          rib_verified_at: string | null
          siret: string | null
          type: Database["public"]["Enums"]["pro_user_type"]
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          apply_vat?: boolean
          commercial_name: string
          company_name: string
          created_at?: string
          id?: number
          kbis_send?: string | null
          kbis_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          kbis_verified_at?: string | null
          profile_id?: string
          rib_send?: string | null
          rib_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          rib_verified_at?: string | null
          siret?: string | null
          type: Database["public"]["Enums"]["pro_user_type"]
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          apply_vat?: boolean
          commercial_name?: string
          company_name?: string
          created_at?: string
          id?: number
          kbis_send?: string | null
          kbis_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          kbis_verified_at?: string | null
          profile_id?: string
          rib_send?: string | null
          rib_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          rib_verified_at?: string | null
          siret?: string | null
          type?: Database["public"]["Enums"]["pro_user_type"]
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pro_infos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
          birth_date: string | null
          created_at: string
          deleted_at: string | null
          email: string
          first_name: string
          id: string
          is_verified: boolean | null
          language: string
          last_name: string
          nb_banned: number
          newsletter: boolean
          pro_infos_verified:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          pro_infos_verified_at: string | null
          role: Database["public"]["Enums"]["role"]
          sumsub_id: string | null
          type: Database["public"]["Enums"]["user_type"] | null
          updated_at: string | null
        }
        Insert: {
          accept_terms_at?: string | null
          accept_terms_history?: Json[] | null
          accept_terms_version?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          first_name: string
          id: string
          is_verified?: boolean | null
          language?: string
          last_name: string
          nb_banned?: number
          newsletter?: boolean
          pro_infos_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          pro_infos_verified_at?: string | null
          role?: Database["public"]["Enums"]["role"]
          sumsub_id?: string | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string | null
        }
        Update: {
          accept_terms_at?: string | null
          accept_terms_history?: Json[] | null
          accept_terms_version?: string | null
          ban_reason?: string | null
          banned_until?: string | null
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_verified?: boolean | null
          language?: string
          last_name?: string
          nb_banned?: number
          newsletter?: boolean
          pro_infos_verified?:
            | Database["public"]["Enums"]["verified_status_type"]
            | null
          pro_infos_verified_at?: string | null
          role?: Database["public"]["Enums"]["role"]
          sumsub_id?: string | null
          type?: Database["public"]["Enums"]["user_type"] | null
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
      sav_documents: {
        Row: {
          content: string
          created_at: string | null
          embedding: string
          id: string
          metadata: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      shipping_in: {
        Row: {
          created_at: string
          current_status: Database["erp"]["Enums"]["shipping_status_enum"]
          fees: number
          id: number
          insurance: number | null
          parcel_id: string | null
          profile_id: string
          shipping_method: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          current_status: Database["erp"]["Enums"]["shipping_status_enum"]
          fees?: number
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          profile_id?: string
          shipping_method?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          current_status?: Database["erp"]["Enums"]["shipping_status_enum"]
          fees?: number
          id?: number
          insurance?: number | null
          parcel_id?: string | null
          profile_id?: string
          shipping_method?: string | null
          statuses?:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          tracking_link?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_in_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      deal_with_variant_reference_view: {
        Row: {
          address: string | null
          address_country: string | null
          address_id: number | null
          anomaly: Json | null
          authentified_at: string | null
          bic: string | null
          cancelled_at: string | null
          city: string | null
          complement: string | null
          created_at: string | null
          deleted_at: string | null
          devise: string | null
          email: string | null
          email_send:
            | Database["public"]["CompositeTypes"]["email_send_enum_type"][]
            | null
          fees: number | null
          first_name: string | null
          id: number | null
          language: string | null
          last_name: string | null
          payed_at: string | null
          payment_account: string | null
          payment_country: string | null
          payment_type: Database["public"]["Enums"]["payment_type"] | null
          phone: string | null
          price: number | null
          profile_first_name: string | null
          profile_id: string | null
          profile_last_name: string | null
          received_at: string | null
          returned_at: string | null
          returned_reason: string | null
          shipping: Json | null
          shipping_in_id: number | null
          status: string | null
          updated_at: string | null
          variant: Json | null
          variant_id: number | null
          vat: Database["public"]["Enums"]["tva_type"] | null
          zipcode: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_shipping_in_id_fkey"
            columns: ["shipping_in_id"]
            isOneToOne: false
            referencedRelation: "shipping_in"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_shipping_in_id_fkey"
            columns: ["shipping_in_id"]
            isOneToOne: false
            referencedRelation: "shipping_in_with_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "detailed_listings_view"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "last_and_best_prices_by_reference_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      detailed_listings_view: {
        Row: {
          best_price: number | null
          brand: Database["public"]["Enums"]["brand"] | null
          created_at: string | null
          duration: number | null
          expires_at: string | null
          id: number | null
          last_price: number | null
          name: string | null
          price: number | null
          profile_id: string | null
          reference: Json | null
          reference_id: number | null
          sku: string | null
          updated_at: string | null
          url_image: string | null
          variant_id: number | null
          variant_size: string | null
          vat: Database["public"]["Enums"]["tva_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "get_wtb_references_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["reference_id"]
          },
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "references_with_wtb_status_view"
            referencedColumns: ["id"]
          },
        ]
      }
      get_wtb_references_view: {
        Row: {
          brand: Database["public"]["Enums"]["brand"] | null
          created_at: string | null
          id: number | null
          is_online: boolean | null
          name: string | null
          sku: string | null
          url_image: string | null
          variants: Json | null
        }
        Relationships: []
      }
      last_and_best_prices_by_reference_view: {
        Row: {
          best_price: number | null
          id: number | null
          last_price: number | null
          reference_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "get_wtb_references_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "offers_with_details"
            referencedColumns: ["reference_id"]
          },
          {
            foreignKeyName: "variant_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "references_with_wtb_status_view"
            referencedColumns: ["id"]
          },
        ]
      }
      offers_with_details: {
        Row: {
          brand: Database["public"]["Enums"]["brand"] | null
          created_at: string | null
          expires_at: string | null
          id: number | null
          listing_created_at: string | null
          listing_expires_at: string | null
          listing_id: number | null
          listing_price: number | null
          listing_refreshed_at: string | null
          listing_updated_at: string | null
          listing_vat: Database["public"]["Enums"]["tva_type"] | null
          name: string | null
          price: number | null
          profile_id: string | null
          reference_id: number | null
          replied_at: string | null
          size: string | null
          sku: string | null
          status: Database["public"]["Enums"]["offer_status_type"] | null
          updated_at: string | null
          url_image: string | null
          variant_id: number | null
          view_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      references_with_wtb_status_view: {
        Row: {
          brand: Database["public"]["Enums"]["brand"] | null
          collection: string | null
          colors: Database["public"]["Enums"]["reference_color_enum"][] | null
          colorway: string | null
          created_at: string | null
          id: number | null
          is_online: boolean | null
          name: string | null
          product_id: number | null
          release_date: string | null
          retailed: boolean | null
          similar_sku: string[] | null
          size_chart: Database["public"]["Enums"]["size_chart"] | null
          sizing: Database["public"]["Enums"]["sizing"] | null
          sku: string | null
          title_fr: string | null
          updated_at: string | null
          url_image: string | null
          wtb: boolean | null
        }
        Relationships: []
      }
      shipping_in_with_deals: {
        Row: {
          created_at: string | null
          current_status:
            | Database["erp"]["Enums"]["shipping_status_enum"]
            | null
          deals: Json | null
          deals_count: number | null
          fees: number | null
          id: number | null
          insurance: number | null
          limit_date: string | null
          parcel_id: string | null
          profile_id: string | null
          shipping_method: string | null
          statuses:
            | Database["erp"]["CompositeTypes"]["shipping_status_type"][]
            | null
          total_price: number | null
          total_service_fee: number | null
          tracking_link: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_in_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_days_to_expiration: {
        Args: { p_id: number; p_days: number }
        Returns: undefined
      }
      authorize: {
        Args: { requested_permission: string }
        Returns: boolean
      }
      check_user_verification_rls: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      confirm_current_user_password: {
        Args: { current_plain_password: string }
        Returns: Json
      }
      csv_listings_import: {
        Args: { listings: Json }
        Returns: {
          success_listing_ids: number[]
          error_listings: Json[]
        }[]
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      delete_listings: {
        Args: { ids_to_delete: number[] }
        Returns: {
          cannot_delete_ids: number[]
        }[]
      }
      get_processing_percent_fees: {
        Args: {
          profile_type: Database["public"]["Enums"]["user_type"]
          apply_vat: boolean
          country: string
        }
        Returns: number
      }
      insert_multiple_listings: {
        Args: {
          price: number
          duration_in_days: number
          quantity: number
          variant_id_param: number
          vat: Database["public"]["Enums"]["tva_type"]
        }
        Returns: {
          created_at: string
          duration: number
          expires_at: string
          id: number
          is_active: boolean
          price: number
          profile_id: string
          refreshed_at: string
          updated_at: string | null
          variant_id: number | null
          vat: Database["public"]["Enums"]["tva_type"]
        }[]
      }
      insert_pro_infos_with_address: {
        Args: {
          p_company_name: string
          p_commercial_name: string
          p_type: string
          p_apply_vat: boolean
          p_address: string
          p_city: string
          p_zipcode: string
          p_country: string
          p_vat_number?: string
          p_siret?: string
          p_complement?: string
        }
        Returns: number
      }
      insert_shipping_in: {
        Args: {
          p_deals_id: number[]
          p_tracking_number: string
          p_shipping_method: string
          p_tracking_link: string
          p_current_status: string
          p_parcel_id: number
          p_shipping_fees: number
        }
        Returns: Record<string, unknown>
      }
      log_dev_message: {
        Args: { p_log_level: string; p_message: string }
        Returns: undefined
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      validate_offer_and_create_deal: {
        Args: {
          p_offer_id: number
          p_address_id: number
          p_payment_method_id: number
        }
        Returns: {
          address: string
          address_country: string
          address_id: number | null
          airtable_id: string | null
          authentified_at: string | null
          bic: string | null
          cancelled_at: string | null
          city: string
          complement: string | null
          created_at: string
          devise: string
          email_send:
            | Database["public"]["CompositeTypes"]["email_send_enum_type"][]
            | null
          fees: number
          first_name: string
          id: number
          is_manual_stock_addition: boolean
          last_name: string
          no_fees: boolean
          no_shipping_fees: boolean
          order_item_id: number | null
          payed_at: string | null
          payment_account: string
          payment_country: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          phone: string
          price: number
          profile_id: string
          purchase_item_current_status: string | null
          received_at: string | null
          returned_at: string | null
          returned_reason: string | null
          shipping_in_id: number | null
          status: string
          updated_at: string | null
          variant_id: number
          vat: Database["public"]["Enums"]["tva_type"]
          view_at: string | null
          zipcode: string
        }
      }
    }
    Enums: {
      anomaly_status_type:
        | "awaiting_payment"
        | "to_ship"
        | "shipped"
        | "delivered"
        | "to_receive"
      brand:
        | "Adidas"
        | "Nike"
        | "Air Jordan"
        | "Yeezy"
        | "New Balance"
        | "Asics"
        | "UGG"
        | "Supreme"
        | "Vans"
        | "Autry"
        | "Sonny Angel"
        | "Puma"
        | "Veja"
        | "Crep Protect"
        | "Sp5der"
        | "Stüssy"
        | "Anti Social Social Club"
        | "Eric Emanuel"
        | "Jason Markk"
        | "Denim Tears"
        | "Travis Scott Cactus Jack"
        | "Slaace"
        | "Onitsuka Tiger"
        | "Crocs"
        | "Birkenstock"
        | "Reebok"
        | "Salomon"
        | "Telfar"
        | "Uniqlo"
        | "Fear of God"
        | "Comme Des Garçons"
        | "Limited Resell"
        | "Bape"
        | "Broken Planet"
        | "Converse"
        | "Off-White"
        | "Corteiz"
        | "Billie Eilish"
        | "MSCHF"
        | "Vlone"
        | "Swatch"
        | "Trapstar"
        | "Mizuno"
        | "Taschen"
        | "The North Face"
        | "12Lunes"
        | "Sentiments Clothing"
        | "Undefined 1999"
        | "no_brand"
        | "Make It Shine"
        | "Coast Line"
        | "Revenge"
        | "Maison Mihara Yasuhiro"
        | "Kith"
        | "Jacquemus"
        | "AMI"
        | "Casablanca"
        | "Pop Mart Labubu"
        | "Galéa"
        | "Travis Scott"
        | "Phaidon"
        | "Bearbrick"
        | "Pokemon"
        | "Hoka"
        | "Attention Peinture Fraîche"
        | "Smiski"
        | "Hugo Loppi"
        | "On"
        | "Monacelli"
      cancellation_status: "payment" | "waiting" | "reshipped"
      continents_type:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      offer_status_type:
        | "pending"
        | "cancelled"
        | "expired"
        | "accepted"
        | "refused"
        | "overlooked"
      payment_type: "Paypal" | "Bank"
      pro_user_type: "company" | "self_employed"
      product_type:
        | "sneakers"
        | "vetement"
        | "accessoire"
        | "lifestyle"
        | "nettoyage"
        | "collector"
      reference_color_enum:
        | "blanc"
        | "bleu"
        | "orange"
        | "vert"
        | "noir"
        | "gris"
        | "violet"
        | "jaune"
        | "multicolore"
        | "marron"
        | "beige"
        | "rose"
        | "rouge"
      role: "Admin" | "User" | "Team"
      shipping_status: "pending" | "shipped"
      size_chart:
        | "men"
        | "women"
        | "child"
        | "preschool"
        | "infant"
        | "toddler"
        | "unisex"
        | "kids"
        | "no_size"
        | "unique"
      size_guide:
        | "nike"
        | "adidas"
        | "adidas_adilette"
        | "yeezy"
        | "yeezy_slide"
        | "yeezy_foam"
        | "ugg"
        | "asics"
        | "new_balance"
        | "no_size"
        | "unique"
        | "puma"
        | "vetement"
        | "hoka"
        | "crocs"
      sizing:
        | "2_lower"
        | "1_5_lower"
        | "1_lower"
        | "0_5_lower"
        | "normal"
        | "0_5_higher"
        | "1_higher"
        | "1_5_higher"
        | "2_higher"
        | "0%"
        | "25%"
        | "50%"
        | "75%"
        | "100%"
      transaction_status:
        | "shipping"
        | "reception"
        | "authentication"
        | "payment"
        | "cancelled"
      tva_type: "marge" | "0" | "20" | "exo"
      user_type: "Pro" | "Perso"
      verified_status_type: "pending" | "refused" | "verified" | "needed"
    }
    CompositeTypes: {
      email_send_enum_type: {
        type: string | null
        timestamp: string | null
      }
      order_item_type: {
        discount_price: number | null
        price: number | null
        exact_sku: string | null
        size: string | null
        from: string | null
        to: string | null
        product_id: number | null
        id: string | null
      }
      return_item_anomaly_status_enum_type: {
        status: Database["public"]["Enums"]["anomaly_status_type"] | null
        timestamp: string | null
      }
      shipping_anomaly_status_enum_type: {
        status: Database["public"]["Enums"]["anomaly_status_type"] | null
        timestamp: string | null
      }
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
  admin: {
    Enums: {},
  },
  erp: {
    Enums: {
      order_item_status_enum: [
        "to_confirm",
        "order_confirmed",
        "processing",
        "purchase_on_the_way",
        "authentication",
        "to_ship",
        "shipped",
        "cancelled",
        "returned",
      ],
      order_item_status_enumold: [
        "order_confirmed",
        "in_preparation",
        "processing",
        "purchase_on_the_way",
        "authentication",
        "shipped",
        "to_ship",
        "to_confirm",
      ],
      purchase_item_state_enum: ["new", "damaged_box", "replacement_box"],
      purchase_item_status_enum: [
        "supplier_ship",
        "reception",
        "authentication",
        "in_stock",
        "shipped",
        "to_cancel",
        "cancelled",
        "anomaly",
      ],
      purchase_item_status_enumold: [
        "reception",
        "authentication",
        "in_stock",
        "to_cancel",
        "cancelled",
        "lost",
        "reserved",
        "gift",
        "to_ship",
        "supplier_ship",
        "shipped",
      ],
      return_item_status_enum: [
        "pending",
        "announced",
        "refunded",
        "cancelled",
        "to_verify",
        "to_ship",
        "reception",
        "to_refund",
        "anomaly",
      ],
      sav_ticket_message_type_enum: ["agent", "customer", "internal"],
      sav_ticket_status_enum: [
        "open",
        "closed",
        "waiting_customer",
        "waiting_third_party",
        "in_progress",
        "resolved",
      ],
      shipping_status_enum: [
        "pending",
        "announced",
        "delivered",
        "back_to_sender",
        "on_the_way",
        "at_service_point",
        "cancelled",
      ],
      supplier_type_enum: ["retailer", "marketplace", "hub"],
    },
  },
  public: {
    Enums: {
      anomaly_status_type: [
        "awaiting_payment",
        "to_ship",
        "shipped",
        "delivered",
        "to_receive",
      ],
      brand: [
        "Adidas",
        "Nike",
        "Air Jordan",
        "Yeezy",
        "New Balance",
        "Asics",
        "UGG",
        "Supreme",
        "Vans",
        "Autry",
        "Sonny Angel",
        "Puma",
        "Veja",
        "Crep Protect",
        "Sp5der",
        "Stüssy",
        "Anti Social Social Club",
        "Eric Emanuel",
        "Jason Markk",
        "Denim Tears",
        "Travis Scott Cactus Jack",
        "Slaace",
        "Onitsuka Tiger",
        "Crocs",
        "Birkenstock",
        "Reebok",
        "Salomon",
        "Telfar",
        "Uniqlo",
        "Fear of God",
        "Comme Des Garçons",
        "Limited Resell",
        "Bape",
        "Broken Planet",
        "Converse",
        "Off-White",
        "Corteiz",
        "Billie Eilish",
        "MSCHF",
        "Vlone",
        "Swatch",
        "Trapstar",
        "Mizuno",
        "Taschen",
        "The North Face",
        "12Lunes",
        "Sentiments Clothing",
        "Undefined 1999",
        "no_brand",
        "Make It Shine",
        "Coast Line",
        "Revenge",
        "Maison Mihara Yasuhiro",
        "Kith",
        "Jacquemus",
        "AMI",
        "Casablanca",
        "Pop Mart Labubu",
        "Galéa",
        "Travis Scott",
        "Phaidon",
        "Bearbrick",
        "Pokemon",
        "Hoka",
        "Attention Peinture Fraîche",
        "Smiski",
        "Hugo Loppi",
        "On",
        "Monacelli",
      ],
      cancellation_status: ["payment", "waiting", "reshipped"],
      continents_type: [
        "Africa",
        "Antarctica",
        "Asia",
        "Europe",
        "Oceania",
        "North America",
        "South America",
      ],
      offer_status_type: [
        "pending",
        "cancelled",
        "expired",
        "accepted",
        "refused",
        "overlooked",
      ],
      payment_type: ["Paypal", "Bank"],
      pro_user_type: ["company", "self_employed"],
      product_type: [
        "sneakers",
        "vetement",
        "accessoire",
        "lifestyle",
        "nettoyage",
        "collector",
      ],
      reference_color_enum: [
        "blanc",
        "bleu",
        "orange",
        "vert",
        "noir",
        "gris",
        "violet",
        "jaune",
        "multicolore",
        "marron",
        "beige",
        "rose",
        "rouge",
      ],
      role: ["Admin", "User", "Team"],
      shipping_status: ["pending", "shipped"],
      size_chart: [
        "men",
        "women",
        "child",
        "preschool",
        "infant",
        "toddler",
        "unisex",
        "kids",
        "no_size",
        "unique",
      ],
      size_guide: [
        "nike",
        "adidas",
        "adidas_adilette",
        "yeezy",
        "yeezy_slide",
        "yeezy_foam",
        "ugg",
        "asics",
        "new_balance",
        "no_size",
        "unique",
        "puma",
        "vetement",
        "hoka",
        "crocs",
      ],
      sizing: [
        "2_lower",
        "1_5_lower",
        "1_lower",
        "0_5_lower",
        "normal",
        "0_5_higher",
        "1_higher",
        "1_5_higher",
        "2_higher",
        "0%",
        "25%",
        "50%",
        "75%",
        "100%",
      ],
      transaction_status: [
        "shipping",
        "reception",
        "authentication",
        "payment",
        "cancelled",
      ],
      tva_type: ["marge", "0", "20", "exo"],
      user_type: ["Pro", "Perso"],
      verified_status_type: ["pending", "refused", "verified", "needed"],
    },
  },
} as const
