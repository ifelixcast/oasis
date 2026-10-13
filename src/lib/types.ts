// Row types matching the Supabase schema.
// If you rename a column in Supabase, update it here too.

export type EventStatus = 'open' | 'full' | 'cancelled' | 'completed'

export type Profile = {
  id: string // uuid, same as auth.users.id
  username: string | null
  name: string | null
  birthday: string | null // 'YYYY-MM-DD'
  bio: string | null
  university_id: number | null
  created_at: string
}

export type ProfileStats = {
  id: string
  events_hosted: number
  events_attended: number
}

export type Place = {
  id: number
  profile_id: string | null
  name: string
  address: string | null
  lat: number | null
  lng: number | null
  created_at: string
}

export type Event = {
  id: number
  profile_id: string
  place_id: number | null
  title: string
  description: string | null
  starts_at: string
  expires_at: string
  lat: number | null
  lng: number | null
  max_participants: number | null
  status: EventStatus
  created_at: string
}

export type EventBuddy = {
  id: number
  event_id: number
  profile_id: string
  joined_at: string
}
