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
            }
        }
    }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
