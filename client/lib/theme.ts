// Design tokens: colors, spacing and fonts shared across screens.
// `colors` and `space` are the original placeholders, still used by Home, +, Map, Inbox
// and Edit profile; the groups below them come from the Figma designs.

// Original placeholder colors (first starter code version).
export const colors = {
  background: '#FBF7EF', // sand
  surface: '#FFFFFF',
  text: '#1E2A2B',
  muted: '#6B7778',
  primary: '#0F6E6A', // oasis water
  danger: '#B3261E',
  border: '#E3DCCD',
}

// Spacing sizes (in points) for padding and margins.
export const space = { xs: 4, sm: 8, md: 16, lg: 24 }

// Whim brand tokens (from the Figma sign-in screen).
export const brand = {
  green: '#008570', // also the native splash background in app.json
  butter: '#FFEFAA', // logo
  deepTeal: '#0B5F5C',
  cream: '#F7F0E6', // input fields, links
  creamButton: '#F7EFE5',
}

// Profile screen tokens (from the Figma profile design).
export const profileColors = {
  header: '#77A638',
  surface: '#F4F1EC',
  card: '#FFFFFF',
  border: '#DCE7E5',
  ink: '#16262E',
  slate: '#5B7078',
  handle: '#3B3B3B',
  black: '#000000',
}

// Edit profile screen tokens (from the Figma edit profile design); background reuses profileColors.surface.
export const editProfileColors = {
  card: '#442022', // maroon form card, also the title
  label: 'rgba(255,255,255,0.8)',
  value: '#FFFFFF',
  placeholder: 'rgba(255,255,255,0.6)',
  saveText: '#182A2A',
  deleteText: '#FFFFFF',
}

// Bottom tab bar (Figma "Nav bar tabs"); surfaces and border reuse profileColors.
export const tabColors = {
  active: '#0B5F5C',
  inactive: '#5B7078',
  createActivity: '#F04400', // the orange + (create activity) button
}

// FONTS Loaded in client/app/_layout.tsx via @expo-google-fonts (bricolage-grotesque, intel-one-mono, inter, jost).
export const fonts = {
  regular: 'BricolageGrotesque_400Regular',
  medium: 'BricolageGrotesque_500Medium',
  semiBold: 'BricolageGrotesque_600SemiBold',
  bold: 'BricolageGrotesque_700Bold',
  mono: 'IntelOneMono_400Regular',
  monoBold: 'IntelOneMono_700Bold',
  interBold: 'Inter_700Bold',
  jostBold: 'Jost_700Bold',
}
