import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uxhkfpjacewssrnesvcb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aGtmcGphY2V3c3NybmVzdmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyMDQ1MjMsImV4cCI6MjAxNjc4MDUyM30.FEQmNoZYkJ02mpVl0KMNmJu7MqptqFpaFMy8R4k4QEo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})