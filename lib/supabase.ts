import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vrdcjhdjctvkhadjqiao.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZGNqaGRqY3R2a2hhZGpxaWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjU2MjEsImV4cCI6MjA5MDc0MTYyMX0.HV23S4IbWjQEx0WHAHf8EfJ0sOxkqKgJBX8EdnquCxI'

let client: SupabaseClient | null = null

export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return client
}
