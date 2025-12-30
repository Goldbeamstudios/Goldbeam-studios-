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
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                    email: string | null
                    role: 'user' | 'admin' | 'super_admin'
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    email?: string | null
                    role?: 'user' | 'admin' | 'super_admin'
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    email?: string | null
                    role?: 'user' | 'admin' | 'super_admin'
                }
            },
            appointments: {
                Row: {
                    id: string
                    square_booking_id: string | null
                    customer_id: string | null
                    customer_name: string
                    customer_email: string
                    plan_type: 'audio' | 'audio_video' | 'general'
                    studio: 'A' | 'B'
                    theme: string | null
                    duration_hours: number
                    addons: Json
                    total_price: number
                    booking_date: string
                    start_time: string
                    status: 'pending' | 'confirmed' | 'cancelled'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    square_booking_id?: string | null
                    customer_id?: string | null
                    customer_name: string
                    customer_email: string
                    plan_type: 'audio' | 'audio_video' | 'general'
                    studio: 'A' | 'B'
                    theme?: string | null
                    duration_hours: number
                    addons?: Json
                    total_price: number
                    booking_date: string
                    start_time: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    square_booking_id?: string | null
                    customer_id?: string | null
                    customer_name?: string
                    customer_email?: string
                    plan_type?: 'audio' | 'audio_video' | 'general'
                    studio?: 'A' | 'B'
                    theme?: string | null
                    duration_hours?: number
                    addons?: Json
                    total_price?: number
                    booking_date?: string
                    start_time?: string
                    status?: 'pending' | 'confirmed' | 'cancelled'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
