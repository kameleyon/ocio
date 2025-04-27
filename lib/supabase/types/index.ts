export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          prompt: string
          status: 'pending' | 'generating' | 'completed' | 'failed'
          tech_stack: Json
          created_at: string
          updated_at: string
          download_url?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          prompt: string
          status: 'pending' | 'generating' | 'completed' | 'failed'
          tech_stack: Json
          created_at?: string
          updated_at?: string
          download_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          prompt?: string
          status?: 'pending' | 'generating' | 'completed' | 'failed'
          tech_stack?: Json
          created_at?: string
          updated_at?: string
          download_url?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}