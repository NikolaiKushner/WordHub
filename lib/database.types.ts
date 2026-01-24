// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Theme options for public profiles
export type ProfileTheme =
  | "default"
  | "dark"
  | "gradient"
  | "minimal"
  | "ocean";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          role: "regular" | "superadmin";
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "regular" | "superadmin";
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "regular" | "superadmin";
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      public_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          theme: ProfileTheme;
          is_published: boolean;
          page_views: number;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: ProfileTheme;
          is_published?: boolean;
          page_views?: number;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: ProfileTheme;
          is_published?: boolean;
          page_views?: number;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      links: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          icon: string | null;
          position: number;
          clicks: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          icon?: string | null;
          position?: number;
          clicks?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          icon?: string | null;
          position?: number;
          clicks?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      page_analytics: {
        Row: {
          id: string;
          profile_id: string;
          link_id: string | null;
          event_type: string;
          referrer: string | null;
          user_agent: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          link_id?: string | null;
          event_type: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          link_id?: string | null;
          event_type?: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_link_clicks: {
        Args: { link_id: string };
        Returns: void;
      };
      increment_page_views: {
        Args: { profile_id: string };
        Returns: void;
      };
    };
    Enums: {
      user_role: "regular" | "superadmin";
    };
  };
}

// Helper types for easier usage
export type PublicProfile =
  Database["public"]["Tables"]["public_profiles"]["Row"];
export type PublicProfileInsert =
  Database["public"]["Tables"]["public_profiles"]["Insert"];
export type PublicProfileUpdate =
  Database["public"]["Tables"]["public_profiles"]["Update"];

export type Link = Database["public"]["Tables"]["links"]["Row"];
export type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
export type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];
