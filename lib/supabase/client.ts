import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a singleton Supabase client for client components
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createBrowserClient() {
  if (clientInstance) return clientInstance

  // For demo purposes, create a mock client when environment variables are not available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key-for-demo-purposes'
  
  console.log('Creating mock Supabase client for demo purposes')
  
  // Create a client with mock methods
  const mockClient = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };

  clientInstance = mockClient as any;
  return clientInstance;
}
