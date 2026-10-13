import { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { colors, space } from '../lib/theme'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function signIn() {
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) Alert.alert('Sign in failed', error.message)
    // On success, AuthContext gets the new session and the router switches to (app).
  }

  async function signUp() {
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) {
      Alert.alert('Sign up failed', error.message)
    } else if (!data.session) {
      Alert.alert('Check your email', 'Confirm your address, then sign in.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oasis</Text>
      <Text style={styles.subtitle}>Find people nearby who are free right now.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={signIn} disabled={busy}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
      <Pressable style={styles.linkButton} onPress={signUp} disabled={busy}>
        <Text style={styles.linkText}>Create an account</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: space.lg, backgroundColor: colors.background },
  title: { fontSize: 40, fontWeight: '700', color: colors.primary },
  subtitle: { fontSize: 16, color: colors.muted, marginBottom: space.lg },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: space.md,
    marginBottom: space.sm,
    fontSize: 16,
  },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: space.md, alignItems: 'center', marginTop: space.sm },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { padding: space.md, alignItems: 'center' },
  linkText: { color: colors.primary, fontSize: 16 },
})
