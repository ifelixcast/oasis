// Inbox tab: placeholder so the Inbox tab has somewhere to go.
// Replace with messages / event updates later.
import { StyleSheet, Text, View } from 'react-native'
import { colors, space } from '../../lib/theme'

// A full screen with one centered message.
export default function InboxScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inbox is coming soon.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.lg, backgroundColor: colors.background },
  text: { fontSize: 16, color: colors.muted },
})
