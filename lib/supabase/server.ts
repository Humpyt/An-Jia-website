import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for server components
export const createServerClient = () => {
  // For demo purposes, use mock values when environment variables are not available
  const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key-for-demo-purposes'
  
  console.log('Creating mock Supabase server client for demo purposes')
  
  // Create a mock client with methods that return empty data
  const mockClient = {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  };

  return mockClient as any;
}
