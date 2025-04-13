export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string
          neighborhood: string | null
          address: string | null
          price: number
          currency: "UGX" | "USD"
          bedrooms: number
          bathrooms: number
          size: number | null
          amenities: string[] | null
          features: string[] | null
          is_premium: boolean
          views: number
          payment_terms: string | null
          owner_id: string | null
          agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location: string
          neighborhood?: string | null
          address?: string | null
          price: number
          currency: "UGX" | "USD"
          bedrooms: number
          bathrooms: number
          size?: number | null
          amenities?: string[] | null
          features?: string[] | null
          is_premium?: boolean
          views?: number
          payment_terms?: string | null
          owner_id?: string | null
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string
          neighborhood?: string | null
          address?: string | null
          price?: number
          currency?: "UGX" | "USD"
          bedrooms?: number
          bathrooms?: number
          size?: number | null
          amenities?: string[] | null
          features?: string[] | null
          is_premium?: boolean
          views?: number
          payment_terms?: string | null
          owner_id?: string | null
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      neighborhoods: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          coordinates: Json | null
          average_price: number | null
          properties_count: number
          amenities: Json | null
          highlights: string[] | null
          property_types: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          coordinates?: Json | null
          average_price?: number | null
          properties_count?: number
          amenities?: Json | null
          highlights?: string[] | null
          property_types?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          coordinates?: Json | null
          average_price?: number | null
          properties_count?: number
          amenities?: Json | null
          highlights?: string[] | null
          property_types?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string | null
          name: string
          phone: string | null
          email: string | null
          company: string | null
          bio: string | null
          profile_image_url: string | null
          properties_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          phone?: string | null
          email?: string | null
          company?: string | null
          bio?: string | null
          profile_image_url?: string | null
          properties_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          company?: string | null
          bio?: string | null
          profile_image_url?: string | null
          properties_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      saved_properties: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      property_views: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          agent_id: string | null
          user_id: string | null
          name: string
          email: string
          phone: string | null
          message: string
          status: "new" | "contacted" | "resolved" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          agent_id?: string | null
          user_id?: string | null
          name: string
          email: string
          phone?: string | null
          message: string
          status?: "new" | "contacted" | "resolved" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          agent_id?: string | null
          user_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: "new" | "contacted" | "resolved" | "archived"
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          preferences: Json | null
          is_landlord: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferences?: Json | null
          is_landlord?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          preferences?: Json | null
          is_landlord?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          property_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
      }
    }
  }
}
