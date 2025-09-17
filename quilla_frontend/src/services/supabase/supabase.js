import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
