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
          created_at: string
          user_id: string
          name: string
          description: string
          prompt: string
          status: "pending" | "generating" | "completed" | "failed"
          tech_stack: Json
          download_url: string | null
          structure?: Json
          files?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          description: string
          prompt: string
          status?: "pending" | "generating" | "completed" | "failed"
          tech_stack?: Json
          download_url?: string | null
          structure?: Json
          files?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          description?: string
          prompt?: string
          status?: "pending" | "generating" | "completed" | "failed"
          tech_stack?: Json
          download_url?: string | null
          structure?: Json
          files?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: "free" | "pro" | "enterprise" | null
          generation_count: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise" | null
          generation_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise" | null
          generation_count?: number
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