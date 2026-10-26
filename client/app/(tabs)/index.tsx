// Home tab: lists open events that haven't expired yet, and lets you join them.
import { useCallback, useState } from 'react'
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Event } from '../../../shared/types'
import { colors, space } from '../../lib/theme'

// How many whole minutes until an event expires (never negative).
function minutesLeft(expiresAt: string) {
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 60000))
}

export default function Feed() {
  const { session } = useAuth()
  const userId = session?.user.id
  const [events, setEvents] = useState<Event[]>([])
  // IDs of events the current user has already joined, so we can show "You're in".
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set())
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setRefreshing(true)

    // Open events that haven't expired yet, soonest to expire first.
    // TODO: filter by distance once events have lat/lng (radius feature).
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'open')
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true })

    if (error) Alert.alert('Could not load events', error.message)
    else setEvents(data ?? [])

    // Which of these has the current user already joined?
    if (userId) {
      const { data: joined } = await supabase.from('event_buddies').select('event_id').eq('profile_id', userId)
      setJoinedIds(new Set((joined ?? []).map((row) => row.event_id)))
    }

    setRefreshing(false)
  }, [userId])

  // Reload every time this tab comes into view (e.g. after posting an event).
  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  // Adds the user to the event's buddy list.
  async function join(eventId: number) {
    if (!userId) return
    const { error } = await supabase.from('event_buddies').insert({ event_id: eventId, profile_id: userId })
    if (error) {
      // 23505 = unique violation from the (event_id, profile_id) constraint
      const message = error.code === '23505' ? 'You already joined this event.' : error.message
      Alert.alert('Could not join', message)
      return
    }
    setJoinedIds((prev) => new Set(prev).add(eventId))
  }

  // One event card. The button depends on whether you host it, already joined, or can join.
  function renderItem({ item }: { item: Event }) {
    const isHost = item.profile_id === userId
    const joined = joinedIds.has(item.id)

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.cardBody}>{item.description}</Text> : null}
        <Text style={styles.meta}>Expires in {minutesLeft(item.expires_at)} min</Text>

        {isHost ? (
          <Text style={styles.meta}>You're hosting this</Text>
        ) : joined ? (
          <Text style={styles.joined}>You're in</Text>
        ) : (
          <Pressable style={styles.button} onPress={() => join(item.id)}>
            <Text style={styles.buttonText}>Join</Text>
          </Pressable>
        )}
      </View>
    )
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={{ padding: space.md }}
      data={events}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListEmptyComponent={
        refreshing ? undefined : <Text style={styles.empty}>Nothing happening nearby yet. Start one with the + button.</Text>
      }
    />
  )
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    marginBottom: space.md,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  cardBody: { fontSize: 15, color: colors.text, marginTop: space.xs },
  meta: { fontSize: 14, color: colors.muted, marginTop: space.sm },
  joined: { fontSize: 15, color: colors.primary, fontWeight: '600', marginTop: space.sm },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: space.sm, alignItems: 'center', marginTop: space.sm },
  buttonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: space.lg },
})
