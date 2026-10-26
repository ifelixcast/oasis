import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { colors, space } from '../lib/theme'

// Edit profile screen: opened from "Edit profile" on the You tab.
// Loads your current profile into the form and saves changes back to Supabase.
export default function EditProfile() {
  // One piece of state per form field; interests is the comma-separated text the user types.
  const { session } = useAuth()
  const userId = session?.user.id
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState('')
  const [busy, setBusy] = useState(false)

  // Fill the form with what's saved now.
  useEffect(() => {
    if (!userId) return
    // select('*') so this still loads before the interests column exists.
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) return Alert.alert('Could not load profile', error.message)
        setUsername(data.username ?? '')
        setName(data.name ?? '')
        setBio(data.bio ?? '')
        setInterests((data.interests ?? []).join(', '))
      })
  }, [userId])

  // Saves the form; interests are typed as "Food, Art" and stored as a list.
  async function save() {
    if (!userId) return
    setBusy(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim() || null,
        name: name.trim() || null,
        bio: bio.trim() || null,
        interests: interests
          .split(',')
          .map((interest) => interest.trim())
          .filter(Boolean),
      })
      .eq('id', userId)
    setBusy(false)

    // Show why it failed, or go back to the profile once saved.
    if (error) {
      // 23505 = unique violation on username
      const message = error.code === '23505' ? 'That username is taken. Try another.' : error.message
      Alert.alert('Could not save profile', message)
    } else {
      router.back()
    }
  }

  // The form: one labelled text box per field, then the Save button.
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: space.lg }}>
      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Into (comma separated)</Text>
      <TextInput style={styles.input} value={interests} onChangeText={setInterests} placeholder="Food, Art" />

      <Text style={styles.label}>Bio</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={bio} onChangeText={setBio} multiline />

      <Pressable style={styles.button} onPress={save} disabled={busy}>
        <Text style={styles.buttonText}>Save profile</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  // Screen background, field labels, and the white text boxes.
  container: { flex: 1, backgroundColor: colors.background },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: space.md, marginBottom: space.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: space.md,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  // The teal Save button.
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: space.md, alignItems: 'center', marginTop: space.lg },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
