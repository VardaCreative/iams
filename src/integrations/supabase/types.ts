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
      production_status: {
        Row: {
          adjustments: number
          assigned: number
          category: string
          closing: number
          completed: number
          created_at: string | null
          date: string
          id: string
          min_level: number
          month: string
          name: string
          opening: number
          pending: number
          process: string
          process_stage: string
          status: string
          updated_at: string | null
          wastage: number
        }
        Insert: {
          adjustments?: number
          assigned?: number
          category: string
          closing?: number
          completed?: number
          created_at?: string | null
          date: string
          id?: string
          min_level?: number
          month: string
          name: string
          opening?: number
          pending?: number
          process: string
          process_stage: string
          status?: string
          updated_at?: string | null
          wastage?: number
        }
        Update: {
          adjustments?: number
          assigned?: number
          category?: string
          closing?: number
          completed?: number
          created_at?: string | null
          date?: string
          id?: string
          min_level?: number
          month?: string
          name?: string
          opening?: number
          pending?: number
          process?: string
          process_stage?: string
          status?: string
          updated_at?: string | null
          wastage?: number
        }
        Relationships: []
      }
      raw_materials: {
        Row: {
          category: string
          code: string
          created_at: string | null
          current_stock: number
          description: string | null
          id: string
          last_purchase_date: string | null
          min_stock_level: number
          name: string
          status: string
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          last_purchase_date?: string | null
          min_stock_level?: number
          name: string
          status?: string
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          current_stock?: number
          description?: string | null
          id?: string
          last_purchase_date?: string | null
          min_stock_level?: number
          name?: string
          status?: string
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          aadhaar: string
          address: string
          blood_group: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          staff_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          aadhaar: string
          address: string
          blood_group?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          staff_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          aadhaar?: string
          address?: string
          blood_group?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          staff_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_purchases: {
        Row: {
          created_at: string | null
          id: string
          invoice: string | null
          material_id: string | null
          material_name: string
          purchase_date: string
          purchase_order: string
          quantity: number
          status: string
          total_amount: number
          unit: string
          unit_price: number
          updated_at: string | null
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice?: string | null
          material_id?: string | null
          material_name: string
          purchase_date: string
          purchase_order: string
          quantity?: number
          status?: string
          total_amount?: number
          unit?: string
          unit_price?: number
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice?: string | null
          material_id?: string | null
          material_name?: string
          purchase_date?: string
          purchase_order?: string
          quantity?: number
          status?: string
          total_amount?: number
          unit?: string
          unit_price?: number
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_purchases_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "raw_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_purchases_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_status: {
        Row: {
          adj_plus: number
          category: string
          closing_bal: number
          created_at: string | null
          date: string
          id: string
          min_level: number
          name: string
          opening_bal: number
          purchases: number
          status: string
          updated_at: string | null
          utilised: number
        }
        Insert: {
          adj_plus?: number
          category: string
          closing_bal?: number
          created_at?: string | null
          date: string
          id?: string
          min_level?: number
          name: string
          opening_bal?: number
          purchases?: number
          status?: string
          updated_at?: string | null
          utilised?: number
        }
        Update: {
          adj_plus?: number
          category?: string
          closing_bal?: number
          created_at?: string | null
          date?: string
          id?: string
          min_level?: number
          name?: string
          opening_bal?: number
          purchases?: number
          status?: string
          updated_at?: string | null
          utilised?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_qty: number | null
          created_at: string | null
          date_assigned: string
          date_completed: string | null
          description: string
          id: string
          process_assigned: string
          qty_assigned: number
          remarks: string | null
          rm_assigned: string
          staff_name: string
          status: string
          task_id: string
          updated_at: string | null
          wastage_qty: number | null
        }
        Insert: {
          completed_qty?: number | null
          created_at?: string | null
          date_assigned: string
          date_completed?: string | null
          description: string
          id?: string
          process_assigned: string
          qty_assigned?: number
          remarks?: string | null
          rm_assigned: string
          staff_name: string
          status?: string
          task_id: string
          updated_at?: string | null
          wastage_qty?: number | null
        }
        Update: {
          completed_qty?: number | null
          created_at?: string | null
          date_assigned?: string
          date_completed?: string | null
          description?: string
          id?: string
          process_assigned?: string
          qty_assigned?: number
          remarks?: string | null
          rm_assigned?: string
          staff_name?: string
          status?: string
          task_id?: string
          updated_at?: string | null
          wastage_qty?: number | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string
          contact_person: string
          created_at: string | null
          email: string
          gstin: string
          id: string
          name: string
          phone: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_person: string
          created_at?: string | null
          email: string
          gstin: string
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          gstin?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string | null
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
      [_ in never]: never
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
