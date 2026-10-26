// Sign-in screen: the only screen you see when logged out (from the Figma login design).
// Same form for both actions: "Sign In" logs in, "Create account" signs up.
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { supabase } from '../lib/supabase'
import { brand, fonts } from '../lib/theme'

// Figma frame is 393pt wide; the logo scales with screen width.
const FRAME_WIDTH = 393
const LOGO = { width: 389, height: 211.561, left: 6 }
// The Figma fill rectangle ends before the mask does, hiding the specks under the letters.
const LOGO_VISIBLE_HEIGHT = 166.52

export default function SignIn() {
  const { width } = useWindowDimensions()
  const scale = width / FRAME_WIDTH
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function signIn() {
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) Alert.alert('Sign in failed', error.message)
    // On success, AuthContext gets the new session and the router switches to (tabs).
  }

  // If email confirmation is on in Supabase, there's no session until the user confirms.
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Spacers use the Figma vertical gaps as flex weights so the layout keeps its proportions on any height. */}
      <View style={{ flex: 150 }} />

      {/* The logo PNG is an alpha mask in Figma; tinting it reproduces the masked butter fill. */}
      <View style={{ height: LOGO_VISIBLE_HEIGHT * scale, overflow: 'hidden' }}>
        <Image
          source={require('../assets/images/brand/whim-logo.png')}
          tintColor={brand.cream}
          contentFit="contain"
          accessibilityLabel="Whim!"
          style={{ width: LOGO.width * scale, height: LOGO.height * scale, marginLeft: LOGO.left * scale }}
        />
      </View>

      <View style={{ flex: 106.5 }} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={brand.deepTeal}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.passwordInput]}
        placeholder="Password"
        placeholderTextColor={brand.deepTeal}
        autoComplete="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={signIn}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
        onPress={signUp}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.linkText}>Create account</Text>
      </Pressable>

      <View style={{ flex: 207 }} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.green },
  // Fields and button share the Figma 45pt / 39pt side insets.
  input: {
    height: 50,
    marginLeft: 45,
    marginRight: 39,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: brand.cream,
    fontFamily: fonts.regular,
    fontSize: 24,
    color: brand.deepTeal,
  },
  passwordInput: { marginTop: 19 },
  button: {
    height: 50,
    marginTop: 51,
    marginLeft: 45,
    marginRight: 39,
    borderRadius: 18,
    backgroundColor: brand.creamButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 28, color: brand.deepTeal, textAlign: 'center' },
  linkButton: { marginTop: 18, alignSelf: 'center', opacity: 0.85 },
  linkText: { fontFamily: fonts.semiBold, fontSize: 20, lineHeight: 21.75, color: brand.cream, textAlign: 'center' },
  pressed: { opacity: 0.7 },
})
