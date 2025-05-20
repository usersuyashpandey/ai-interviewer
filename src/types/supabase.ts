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
      interviews: {
        Row: {
          id: string
          created_at: string
          user_id: string
          job_description: string
          resume_text: string
          status: 'in_progress' | 'completed'
          feedback: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          job_description: string
          resume_text: string
          status?: 'in_progress' | 'completed'
          feedback?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          job_description?: string
          resume_text?: string
          status?: 'in_progress' | 'completed'
          feedback?: Json | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          interview_id: string
          role: 'assistant' | 'user'
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          interview_id: string
          role: 'assistant' | 'user'
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          interview_id?: string
          role?: 'assistant' | 'user'
          content?: string
        }
      }
    }
  }
}