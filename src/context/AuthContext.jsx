import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isBlackfangSignInAllowed } from '../lib/blackfangAuth'
import { hasSupabaseEnv, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return () => {}
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const email = session?.user?.email
    if (!email || !supabase) return
    if (isBlackfangSignInAllowed(email)) return
    supabase.auth.signOut()
  }, [session])

  const user = session?.user ?? null
  const allowedUser = user && isBlackfangSignInAllowed(user.email) ? user : null

  const value = useMemo(
    () => ({
      session: allowedUser ? session : null,
      user: allowedUser,
      loading,
      hasSupabaseEnv,
      isSignInAllowed: isBlackfangSignInAllowed,
      signInWithGoogle: async () => {
        if (!supabase) throw new Error('Supabase env vars are missing.')
        const redirectTo = `${window.location.origin}/projects/blackfang-campaign`
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        })
        if (error) throw error
      },
      signOut: async () => {
        if (!supabase) return
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      },
    }),
    [session, allowedUser, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
