import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase authentication is not configured for this preview.')
  }

  return { url, key }
}

export function createClient() {
  if (!client) {
    const { url, key } = getSupabaseConfig()
    client = createBrowserClient(url, key)
  }
  return client
}
