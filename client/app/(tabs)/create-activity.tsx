// Create activity screen (opened by the orange + button in the tab bar).
// Form to post a new activity that stays open for a set number of minutes.
// Activities are saved in the "events" table.
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { colors, space } from '../../lib/theme'

export default function CreateActivity() {
  // Form fields (minutes is text because it comes from a text box) and a flag that
  // disables the button while saving.
  const { session } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [minutes, setMinutes] = useState('60')
  // How many people can join, not counting the host.
  const [spots, setSpots] = useState(3)
  const [busy, setBusy] = useState(false)

  // Checks the form, saves the event, then clears the form and goes back to Home.
  async function post() {
    const expiresIn = parseInt(minutes, 10)
    // Stop early with a friendly message if the form isn't filled in properly.
    if (!title.trim()) return Alert.alert('Add a title', 'Say what you want to do, like "Dumplings in Chinatown".')
    if (!expiresIn || expiresIn <= 0) return Alert.alert('Set a time', 'Enter how many minutes the event stays open.')
    if (!session) return

    // Save the event: it starts now and expires after the chosen number of minutes.
    const now = new Date()
    setBusy(true)
    const { error } = await supabase.from('events').insert({
      profile_id: session.user.id,
      title: title.trim(),
      description: description.trim() || null,
      starts_at: now.toISOString(), // TODO: let the host pick a start time
      expires_at: new Date(now.getTime() + expiresIn * 60000).toISOString(),
      max_participants: spots,
      // TODO: place_id, lat/lng
    })
    setBusy(false)

    if (error) return Alert.alert('Could not post event', error.message)

    // Saved: reset the form for next time and go to Home to see it.
    setTitle('')
    setDescription('')
    setMinutes('60')
    setSpots(3)
    router.navigate('/')
  }

  // The form: what, details, how long, and the Post button.
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: space.lg }}>
      <Text style={styles.label}>What are you doing?</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Dumplings in Chinatown" />

      <Text style={styles.label}>Details (optional)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Meeting outside the T stop"
        multiline
      />

      <Text style={styles.label}>Open for how many minutes?</Text>
      <TextInput style={styles.input} value={minutes} onChangeText={setMinutes} keyboardType="number-pad" />

      <Text style={styles.label}>How many people can join? (not counting you)</Text>
      <View style={styles.stepper}>
        <Pressable
          style={styles.stepButton}
          onPress={() => setSpots((n) => Math.max(1, n - 1))}
          accessibilityRole="button"
          accessibilityLabel="Fewer spots"
        >
          <Text style={styles.stepButtonText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{spots}</Text>
        <Pressable
          style={styles.stepButton}
          onPress={() => setSpots((n) => Math.min(20, n + 1))}
          accessibilityRole="button"
          accessibilityLabel="More spots"
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={post} disabled={busy}>
        <Text style={styles.buttonText}>Post event</Text>
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
  // The − / + spot picker.
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { fontSize: 22, color: colors.primary, fontWeight: '600' },
  stepValue: { fontSize: 20, fontWeight: '600', color: colors.text, minWidth: 28, textAlign: 'center' },
  // The teal Post button.
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: space.md, alignItems: 'center', marginTop: space.lg },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
