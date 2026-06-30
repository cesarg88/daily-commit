export interface Database {
  public: {
    Tables: {
      closed_day_score_snapshots: {
        Row: {
          base_score: number;
          bonus_score: number;
          calculated_at: string;
          day_id: string;
          final_score: number;
          user_id: string;
        };
        Insert: {
          base_score: number;
          bonus_score: number;
          calculated_at?: string;
          day_id: string;
          final_score: number;
          user_id: string;
        };
        Update: {
          base_score?: number;
          bonus_score?: number;
          calculated_at?: string;
          day_id?: string;
          final_score?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_objectives: {
        Row: {
          created_at: string;
          current_value: number | null;
          day_id: string;
          id: string;
          is_completed: boolean;
          kind: "base" | "bonus";
          name_snapshot: string;
          objective_id: string;
          target_value: number | null;
          type: "binary" | "numeric";
          unit: string | null;
          updated_at: string;
          user_id: string;
          weight: number;
        };
        Insert: {
          created_at?: string;
          current_value?: number | null;
          day_id: string;
          id: string;
          is_completed: boolean;
          kind: "base" | "bonus";
          name_snapshot: string;
          objective_id: string;
          target_value?: number | null;
          type: "binary" | "numeric";
          unit?: string | null;
          updated_at?: string;
          user_id: string;
          weight: number;
        };
        Update: {
          created_at?: string;
          current_value?: number | null;
          day_id?: string;
          id?: string;
          is_completed?: boolean;
          kind?: "base" | "bonus";
          name_snapshot?: string;
          objective_id?: string;
          target_value?: number | null;
          type?: "binary" | "numeric";
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
          weight?: number;
        };
        Relationships: [];
      };
      days: {
        Row: {
          closed_at: string | null;
          created_at: string;
          date: string;
          id: string;
          state: "unconfigured" | "draft" | "active" | "closed" | "excluded";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          closed_at?: string | null;
          created_at?: string;
          date: string;
          id: string;
          state: "unconfigured" | "draft" | "active" | "closed" | "excluded";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          closed_at?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          state?: "unconfigured" | "draft" | "active" | "closed" | "excluded";
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      objectives: {
        Row: {
          created_at: string;
          default_target_value: number | null;
          default_unit: string | null;
          default_weight: number | null;
          id: string;
          is_active: boolean;
          name: string;
          type: "binary" | "numeric";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          default_target_value?: number | null;
          default_unit?: string | null;
          default_weight?: number | null;
          id?: string;
          is_active?: boolean;
          name: string;
          type: "binary" | "numeric";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          default_target_value?: number | null;
          default_unit?: string | null;
          default_weight?: number | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          type?: "binary" | "numeric";
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
