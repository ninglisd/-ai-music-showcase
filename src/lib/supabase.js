import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getPublicAudioUrl(path) {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return supabase.storage.from("music").getPublicUrl(path).data.publicUrl
}
