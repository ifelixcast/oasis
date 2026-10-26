import { StyleSheet, Text, View } from 'react-native'
import { colors, space } from '../../lib/theme'

// Placeholder so the Inbox tab has somewhere to go.
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
