# Oasis starter

Starter skeleton for Oasis: post a spontaneous activity, and people nearby can join.
Stack: Expo (React Native) + TypeScript + Expo Router, with Supabase for auth and the database.

The skeleton covers the core loop: **sign up / sign in → post an event → see open events → join one → see your profile and counts.**
Everything else (map, radius, places, reviews, notifications, badges, verification) is left for the team to build on top.

---

## 1. One-time setup (one person does this, then pushes to GitHub)

You need Node.js installed and the **Expo Go** app on your phone (or an iOS/Android simulator).

```bash
# Create the project with the default template (includes Expo Router + TypeScript)
npx create-expo-app@latest oasis
cd oasis

# Remove the template's example screens
npm run reset-project

# Supabase client + session storage
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

Then copy the files from this starter into the project, replacing the `app/` folder that
`reset-project` created:

```
oasis/
├── app/
│   ├── _layout.tsx        # root: AuthProvider + logged-in / logged-out routing
│   ├── sign-in.tsx        # email + password sign in and sign up
│   └── (app)/             # only reachable when logged in
│       ├── _layout.tsx    # bottom tabs
│       ├── index.tsx      # "Nearby" feed: open, unexpired events + Join
│       ├── create.tsx     # "Post": create an event with an expiry timer
│       └── profile.tsx    # profile edit, hosted/attended counts, sign out
├── context/
│   └── AuthContext.tsx    # holds the Supabase session for the whole app
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── types.ts           # TypeScript types for each table
│   └── theme.ts           # shared colors and spacing (placeholder)
├── supabase/
│   └── setup.sql          # profile trigger, profile_stats view, RLS policies
└── .env.example
```

### Environment variables

1. Copy `.env.example` to `.env`.
2. Fill in the project URL and publishable (anon) key from Supabase → Project Settings → API.
3. Add `.env` to `.gitignore` and share the values with teammates privately.

The key is designed to be used in the app; what protects your data is Row Level Security, not hiding the key.

### Database

Run `supabase/setup.sql` in the Supabase SQL editor. It does three things:

1. **Auto-creates a `profiles` row** whenever someone signs up. Without this, inserts into
   `events` fail, because `events.profile_id` points at a profile that doesn't exist yet.
   For it to work, `profiles.id` must reference `auth.users.id`, and every other column on
   `profiles` (username, name, etc.) must be nullable or have a default.
2. **Creates the `profile_stats` view** for hosted/attended counts.
3. **Turns on RLS and adds policies.** Without policies, the app can't read any data.

Before running it, check that the names in the SQL match your tables. It assumes
`profiles`, `places`, `events`, `event_buddies`, `reviews`, with every person column named
`profile_id`. If your reviews table is still called `review`, rename it or edit the SQL.

### Run it

```bash
npx expo start
```

Scan the QR code with Expo Go. Sign up, post an event, and check that it shows up on the Nearby tab.

**Gotcha:** Supabase Auth requires email confirmation by default, so after signing up you'll
get an email before you can sign in. For development you can turn this off under
Authentication → Providers → Email.

---

## 2. What to build next

These are suggestions. Adjust to your group's milestones and what your mentor wants to see.

| Weeks | Focus | Notes |
|---|---|---|
| 1–2 | Setup, auth, profiles | Everyone gets the app running. Profile fields (birthday, university). Decide on the private-data split (mobile, birthday). |
| 3–4 | Events core loop | Event detail screen with the list of buddies. Leave an event. Host can cancel. Enforce `max_participants`. Pick a start time. |
| 5–6 | Location | `expo-location` for the user's position. Attach lat/lng to events. Radius filter on the feed. Map view with pins. Places table hooked up. |
| 7 | Reviews and notifications | Rate a place after an event. Push notifications for new events within your radius. |
| 8 | Safety and polish | Student verification (whatever your mentor decides), location sharing levels, UI pass. |
| 9–10 | Testing and buffer | Fix bugs, test with real students, prepare the demo. |

### Splitting the work

Four areas that can mostly run in parallel once the skeleton is up:

- **Auth and profiles**: sign-up flow, profile editing, avatars, viewing other people's profiles.
- **Events**: feed, create form, event detail, join/leave, status changes.
- **Location and map**: device location, radius filter, map screen, places.
- **Database and backend**: schema changes, RLS policies, views, triggers, notifications.

Keep `lib/types.ts` in sync with the database. Whoever changes a table updates the type in the same commit.

---

## Sources

- Supabase, Build a User Management App with Expo React Native: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- Expo, Create your first app (default template, reset-project): https://docs.expo.dev/tutorial/create-your-first-app
- Expo Router, Protected routes: https://docs.expo.dev/router/advanced/protected/
- Expo Router, Authentication: https://docs.expo.dev/router/advanced/authentication/
- Supabase linter, RLS enabled with no policy: https://supabase.github.io/splinter/0008_rls_enabled_no_policy
