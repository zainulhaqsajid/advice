// Database types generated from our schema
// These provide type-safe queries across the entire app

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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          auth_provider: string;
          nationality: string | null;
          current_visa: string | null;
          target_visa: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          auth_provider?: string;
          nationality?: string | null;
          current_visa?: string | null;
          target_visa?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          auth_provider?: string;
          nationality?: string | null;
          current_visa?: string | null;
          target_visa?: string | null;
          updated_at?: string;
        };
      };
      saved_reports: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          pathway: string;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          pathway: string;
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: string;
          title?: string;
          pathway?: string;
          data?: Json;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          user_id: string | null;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          situation: string;
          form_data: Json;
          recommended_visa: string | null;
          points_score: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          situation: string;
          form_data?: Json;
          recommended_visa?: string | null;
          points_score?: number | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
          recommended_visa?: string | null;
          points_score?: number | null;
        };
      };
      contact_inquiries: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          inquiry_type: string;
          visa_category: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          inquiry_type: string;
          visa_category?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          consultation_type: string;
          preferred_date: string;
          preferred_time: string;
          visa_category: string | null;
          notes: string | null;
          status: string;
          payment_status: string;
          payment_amount: number | null;
          stripe_session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          consultation_type: string;
          preferred_date: string;
          preferred_time: string;
          visa_category?: string | null;
          notes?: string | null;
          status?: string;
          payment_status?: string;
          payment_amount?: number | null;
          stripe_session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          payment_status?: string;
          stripe_session_id?: string | null;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          category: string;
          tags: string[];
          author: string;
          published: boolean;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          category: string;
          tags?: string[];
          author: string;
          published?: boolean;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          category?: string;
          tags?: string[];
          author?: string;
          published?: boolean;
          featured_image?: string | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          visa_category: string;
          rating: number;
          review: string;
          country_of_origin: string | null;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          visa_category: string;
          rating: number;
          review: string;
          country_of_origin?: string | null;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          approved?: boolean;
        };
      };
      occupations: {
        Row: {
          id: string;
          anzsco_code: string;
          title: string;
          description: string | null;
          assessing_authority: string | null;
          eligible_visas: string[];
          skill_level: number | null;
          on_mltssl: boolean;
          on_stsol: boolean;
          on_rol: boolean;
          state_nominations: Json | null;
          last_invitation_round: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          anzsco_code: string;
          title: string;
          description?: string | null;
          assessing_authority?: string | null;
          eligible_visas?: string[];
          skill_level?: number | null;
          on_mltssl?: boolean;
          on_stsol?: boolean;
          on_rol?: boolean;
          state_nominations?: Json | null;
          last_invitation_round?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          assessing_authority?: string | null;
          eligible_visas?: string[];
          skill_level?: number | null;
          on_mltssl?: boolean;
          on_stsol?: boolean;
          on_rol?: boolean;
          state_nominations?: Json | null;
          last_invitation_round?: Json | null;
          updated_at?: string;
        };
      };
      invitation_rounds: {
        Row: {
          id: string;
          round_date: string;
          visa_subclass: string;
          occupation_group: string | null;
          anzsco_code: string | null;
          invitations_issued: number;
          minimum_points: number | null;
          latest_doe: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          round_date: string;
          visa_subclass: string;
          occupation_group?: string | null;
          anzsco_code?: string | null;
          invitations_issued: number;
          minimum_points?: number | null;
          latest_doe?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          invitations_issued?: number;
          minimum_points?: number | null;
          latest_doe?: string | null;
        };
      };
      state_nominations: {
        Row: {
          id: string;
          state_code: string;
          state_name: string;
          visa_subclass: string;
          requirements: Json;
          occupation_list_url: string | null;
          is_open: boolean;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          state_code: string;
          state_name: string;
          visa_subclass: string;
          requirements?: Json;
          occupation_list_url?: string | null;
          is_open?: boolean;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          requirements?: Json;
          occupation_list_url?: string | null;
          is_open?: boolean;
          last_updated?: string;
        };
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
  };
}

// Convenience types for use throughout the app
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SavedReport = Database['public']['Tables']['saved_reports']['Row'];
export type Assessment = Database['public']['Tables']['assessments']['Row'];
export type ContactInquiry = Database['public']['Tables']['contact_inquiries']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type Occupation = Database['public']['Tables']['occupations']['Row'];
export type InvitationRound = Database['public']['Tables']['invitation_rounds']['Row'];
export type StateNomination = Database['public']['Tables']['state_nominations']['Row'];
