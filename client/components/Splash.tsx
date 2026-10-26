import { StyleSheet, View, ViewProps } from 'react-native'
import { Image } from 'expo-image'
import { brand } from '../lib/theme'

// Splash screen drawn by the app while fonts and the login check load.
// It copies the phone's built-in splash (set in app.json) so the switch between them is invisible:
// keep the logo size and background color here in sync with the expo-splash-screen settings.

// Figma "iPhone 16 - 7"
const LOGO = { width: 389, aspectRatio: 778 / 424 }

// Shown while fonts and the auth session load
export default function Splash({ onLayout }: Pick<ViewProps, 'onLayout'>) {
  return (
    <View style={styles.container} onLayout={onLayout}>
      <Image
        source={require('../assets/images/brand/splash-logo.png')}
        contentFit="contain"
        accessibilityLabel="Whim!"
        style={{ width: LOGO.width, aspectRatio: LOGO.aspectRatio }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.green, alignItems: 'center', justifyContent: 'center' },
})
