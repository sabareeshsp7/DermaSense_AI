export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: string | null
          contact_number: string | null
          address: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          contact_number?: string | null
          address?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          contact_number?: string | null
          address?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          theme: string
          language: string
          notifications_enabled: boolean
          email_notifications: boolean
          measurement_unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          theme?: string
          language?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          measurement_unit?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          theme?: string
          language?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          measurement_unit?: string
          created_at?: string
          updated_at?: string
        }
      }
      medical_histories: {
        Row: {
          id: string
          user_id: string
          condition_name: string
          diagnosis_date: string
          treatment: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          condition_name: string
          diagnosis_date: string
          treatment?: string | null
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          condition_name?: string
          diagnosis_date?: string
          treatment?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

