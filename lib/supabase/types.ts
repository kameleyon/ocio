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
          structure?: Json
          files?: Json
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
          structure?: Json
          files?: Json
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
          structure?: Json
          files?: Json
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
          subscription_tier: string
          generation_count: number
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string
          generation_count?: number
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string
          generation_count?: number
        }
      }
      project_logs: {
        Row: {
          id: number
          project_id: string
          created_at: string
          level: 'info' | 'error' | 'warning' | 'command' | 'debug' | 'success'
          message: string
          details?: Json
        }
        Insert: {
          id?: number
          project_id: string
          created_at?: string
          level: 'info' | 'error' | 'warning' | 'command' | 'debug' | 'success'
          message: string
          details?: Json
        }
        Update: {
          id?: number
          project_id?: string
          created_at?: string
          level?: 'info' | 'error' | 'warning' | 'command' | 'debug' | 'success'
          message?: string
          details?: Json
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