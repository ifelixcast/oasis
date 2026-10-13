import { Tabs } from 'expo-router'
import { colors } from '../../lib/theme'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen name="index" options={{ title: 'Nearby' }} />
      <Tabs.Screen name="create" options={{ title: 'Post' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
