// Map tab: placeholder so the Map tab has somewhere to go.
// Replace with a real map of nearby events later.
import { StyleSheet, Text, View } from 'react-native'
import { colors, space } from '../../lib/theme'

// A full screen with one centered message.
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map is coming soon.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.lg, backgroundColor: colors.background },
  text: { fontSize: 16, color: colors.muted },
})
