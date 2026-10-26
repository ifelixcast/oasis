// The one Supabase client the whole app uses to talk to the database and auth.
// URL and key come from .env (EXPO_PUBLIC_ variables are bundled into the app; that's
// fine for the publishable key because Row Level Security protects the data).
import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    // On web, let Supabase pick its own storage: localStorage in the browser, memory during
    // static rendering on the server (where AsyncStorage crashes because there is no window).
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage as any } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Only refresh the auth token while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
