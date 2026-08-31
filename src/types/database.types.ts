export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      donations: {
        Row: {
          id: string;
          campaign_id: string | null;
          donor_name: string;
          donor_email: string;
          donor_phone: string;
          donor_address: string;
          donor_gender: "male" | "female" | "other" | null;
          amount: number;
          payment_status: "pending" | "success" | "failed" | null;
          invoice_number: string;
          package_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          donor_name: string;
          donor_email: string;
          donor_phone: string;
          donor_address: string;
          donor_gender?: "male" | "female" | "other" | null;
          amount: number;
          payment_status?: "pending" | "success" | "failed" | null;
          invoice_number: string;
          package_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          donor_name?: string;
          donor_email?: string;
          donor_phone?: string;
          donor_address?: string;
          donor_gender?: "male" | "female" | "other" | null;
          amount?: number;
          payment_status?: "pending" | "success" | "failed" | null;
          invoice_number?: string;
          package_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "donations_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "donation_packages";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          goal_amount: number;
          current_amount: number | null;
          end_date: string | null;
          status: "active" | "completed" | "cancelled" | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          goal_amount: number;
          current_amount?: number | null;
          end_date?: string | null;
          status?: "active" | "completed" | "cancelled" | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          goal_amount?: number;
          current_amount?: number | null;
          end_date?: string | null;
          status?: "active" | "completed" | "cancelled" | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          current_amount: number;
          goal_amount: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          current_amount?: number;
          goal_amount?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          current_amount?: number;
          goal_amount?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      donation_packages: {
        Row: {
          id: string;
          campaign_id: string | null;
          name: string;
          amount: number;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id?: string | null;
          name: string;
          amount: number;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string | null;
          name?: string;
          amount?: number;
          description?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "donation_packages_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
