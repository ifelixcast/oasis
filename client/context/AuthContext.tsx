// Keeps track of who is logged in, for the whole app.
// Any screen can call useAuth() to get the current Supabase session (null when logged out).
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// What useAuth() gives you.
type AuthContextValue = {
  session: Session | null
  loading: boolean
}

// The shared "box" that holds the value; starts as logged out and still loading.
const AuthContext = createContext<AuthContextValue>({ session: null, loading: true })

// Wrap the app in this (see client/app/_layout.tsx) so every screen can read the session.
export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On start-up: read any session saved from last time.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Afterwards: update whenever the user signs in or out, or the token refreshes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // Stop listening if the provider is ever removed.
    return () => subscription.unsubscribe()
  }, [])

  // Hand the current session to everything inside.
  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}

// Call this in any screen: const { session, loading } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
