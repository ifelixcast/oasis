// Tabs layout: every screen in this (tabs) folder shows the bottom tab bar.
// The parentheses mean the folder name isn't part of the URL (/profile, not /(tabs)/profile).
import { Tabs } from 'expo-router'
import NavBar from '../../components/NavBar'

export default function TabsLayout() {
  return (
    // NavBar draws the custom bar; `name` matches the file name, `title` is the tab label.
    <Tabs tabBar={(props) => <NavBar {...props} />}>
      {/* Order matches the Figma tab bar: Home, Map, +, Inbox, You.
          "create-activity" is the orange + button, so its title only shows in that screen's top bar.
          "profile" draws its own green header, so the default top bar is hidden there. */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="create-activity" options={{ title: 'Start an activity' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
      <Tabs.Screen name="profile" options={{ title: 'You', headerShown: false }} />
    </Tabs>
  )
}
