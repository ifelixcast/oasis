import { StyleSheet, Text, View } from 'react-native'
import { colors, space } from '../../lib/theme'

// Placeholder so the Map tab has somewhere to go.
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
