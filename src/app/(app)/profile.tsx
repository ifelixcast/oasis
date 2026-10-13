import { useCallback, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { ProfileStats } from '../../lib/types'
import { colors, space } from '../../lib/theme'

export default function ProfileScreen() {
  const { session } = useAuth()
  const userId = session?.user.id
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, name, bio')
      .eq('id', userId)
      .single()

    if (error) {
      Alert.alert('Could not load profile', error.message)
    } else {
      setUsername(profile.username ?? '')
      setName(profile.name ?? '')
      setBio(profile.bio ?? '')
    }

    // Counts come from the profile_stats view (see supabase/setup.sql).
    const { data: statsRow } = await supabase.from('profile_stats').select('*').eq('id', userId).single()
    setStats(statsRow)
  }, [userId])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  async function save() {
    if (!userId) return
    setBusy(true)
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim() || null, name: name.trim() || null, bio: bio.trim() || null })
      .eq('id', userId)
    setBusy(false)

    if (error) {
      // 23505 = unique violation on username
      const message = error.code === '23505' ? 'That username is taken. Try another.' : error.message
      Alert.alert('Could not save profile', message)
    } else {
      Alert.alert('Profile saved')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: space.lg }}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats?.events_hosted ?? 0}</Text>
          <Text style={styles.statLabel}>Hosted</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats?.events_attended ?? 0}</Text>
          <Text style={styles.statLabel}>Attended</Text>
        </View>
      </View>

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Bio</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={bio} onChangeText={setBio} multiline />

      <Pressable style={styles.button} onPress={save} disabled={busy}>
        <Text style={styles.buttonText}>Save profile</Text>
      </Pressable>

      <Pressable style={styles.linkButton} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOut}>Sign out</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statsRow: { flexDirection: 'row', gap: space.md, marginBottom: space.md },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 14, color: colors.muted },
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
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: space.md, alignItems: 'center', marginTop: space.lg },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton: { padding: space.md, alignItems: 'center' },
  signOut: { color: colors.danger, fontSize: 16 },
})
