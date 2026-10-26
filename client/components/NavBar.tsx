// Custom bottom tab bar (Figma "Nav - App tabs"): Home, Map, the orange + (create activity), Inbox, You.
// Used by app/(tabs)/_layout.tsx. Tab labels come from each screen's `title` option there.
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import type { BottomTabBarProps } from 'expo-router/tabs'
import { fonts, profileColors, tabColors } from '../lib/theme'

// Icons from the Figma "Nav - App tabs". They are single-color outlines, tinted per state.
const ICONS: Record<string, number> = {
  index: require('../assets/images/tabs/home.svg'),
  map: require('../assets/images/tabs/map.svg'),
  inbox: require('../assets/images/tabs/inbox.svg'),
  profile: require('../assets/images/tabs/you.svg'),
}

// Keys are route (file) names in app/(tabs).
// The middle route (app/(tabs)/create-activity.tsx) is drawn as the raised orange + button.
const CREATE_ACTIVITY_ROUTE = 'create-activity'

// Expo Router passes in the tab routes (state), each screen's options (descriptors),
// a function to switch tabs, and the safe-area sizes (insets).
export default function NavBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  return (
    // The white bar holding the icons of the nav bar; extra bottom padding keeps it above
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        // Only routes with an icon (plus the create activity button) get a tab.
        if (!(route.name in ICONS) && route.name !== CREATE_ACTIVITY_ROUTE) return null

        // Is this the tab you're on, and what text goes under its icon.
        const focused = state.index === index
        const label = options.title ?? route.name

        // Switch tabs (tapping the tab you're already on does nothing).
        function onPress() {
          if (!focused) navigateToTab(route.key)
        }

        // The orange + (create activity) button: no label, raised above the bar.
        if (route.name === CREATE_ACTIVITY_ROUTE) {
          return (
            <View key={route.key} style={styles.tab}>
              <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: focused }}
                style={({ pressed }) => [styles.createActivityButton, pressed && styles.pressed]}
              >
                <Image source={require('../assets/images/tabs/create-activity-plus.svg')} style={styles.createActivityIcon} />
              </Pressable>
            </View>
          )
        }

        // A normal tab: icon and label, teal when selected and grey otherwise.
        const color = focused ? tabColors.active : tabColors.inactive
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Image source={ICONS[route.name]} tintColor={color} style={styles.icon} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  // Five equal-width tabs with 10pt padding on each side and 8pt above
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: profileColors.card,
    borderTopWidth: 0.75,
    borderTopColor: profileColors.border,
  },
  // One tab slot, its icon, and its label.
  tab: { flex: 1, alignItems: 'center', gap: 1.48 },
  icon: { width: 22, height: 22 },
  label: { fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 15.95, textAlign: 'center' },
  // + create button raised 19pt above the other buttons.
  createActivityButton: {
    width: 56,
    height: 56,
    marginTop: -19.03,
    borderRadius: 20,
    backgroundColor: tabColors.createActivity,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 20px -8px rgba(255, 179, 33, 0.8)',
  },
  createActivityIcon: { width: 28, height: 28 },
  // Slight fade while a button is being pressed.
  pressed: { opacity: 0.7 },
})
