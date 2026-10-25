// Placeholder design tokens so screens share one look.
// Replace once your group settles on a visual direction.
export const colors = {
  background: '#FBF7EF', // sand
  surface: '#FFFFFF',
  text: '#1E2A2B',
  muted: '#6B7778',
  primary: '#0F6E6A', // oasis water
  danger: '#B3261E',
  border: '#E3DCCD',
}

export const space = { xs: 4, sm: 8, md: 16, lg: 24 }

// Whim brand tokens (from the Figma sign-in screen).
export const brand = {
  green: '#008570',
  butter: '#FFEFAA', // logo
  deepTeal: '#0B5F5C',
  cream: '#F7F0E6', // input fields, links
  creamButton: '#F7EFE5',
}

// Loaded in app/_layout.tsx via @expo-google-fonts/bricolage-grotesque.
export const fonts = {
  regular: 'BricolageGrotesque_400Regular',
  semiBold: 'BricolageGrotesque_600SemiBold',
  bold: 'BricolageGrotesque_700Bold',
}
