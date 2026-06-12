import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno de Vite
const supabaseUrl = `https://${import.meta.env.VITE_SUPABASE_KEY}.supabase.co`
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
