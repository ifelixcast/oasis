import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { editProfileColors, fonts, profileColors } from '../lib/theme'

// Figma edit profile frame: everything is laid out in a 376pt column, centered on wider screens.
// Tops below are measured from the top of that column (just under the status bar).
const COLUMN = { width: 376, height: 748 }
// Maroon card and photo
const CARD = { left: 21, top: 164, width: 336, height: 447.613 }
const AVATAR = { left: 124, top: 100, width: 129, height: 142 }
const AVATAR_IMAGE = { left: -15.02, width: 163.79 } // The avatar image
const DIVIDER_TOPS = [323, 368, 430, 475] // White lines between the fields.
const ROW = { left: 39, width: 301, height: 22 } // Field rows: label on left at x=39, value right-aligned x=340.

// Edit profile screen: opened from "Edit profile" on the You tab.
// Loads your current profile into the form and saves changes back to Supabase.
export default function EditProfile() {
  // One piece of state per form field.
  const { session } = useAuth()
  const userId = session?.user.id
  const insets = useSafeAreaInsets()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  // TODO: profiles has no phone column yet, so this field isn't loaded or saved.
  const [phone, setPhone] = useState('')
  // The saved photo's URL, and a newly picked photo that's uploaded when you press Save.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [pickedPhoto, setPickedPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [busy, setBusy] = useState(false)

  // Fill the form with what's saved now.
  useEffect(() => {
    if (!userId) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) return Alert.alert('Could not load profile', error.message)
        setUsername(data.username ?? '')
        setName(data.name ?? '')
        setBio(data.bio ?? '')
        setAvatarUrl(data.avatar_url ?? null)
      })
  }, [userId])

  // Opens the photo library, cropped to roughly the avatar's shape; the photo is only previewed until Save.
  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [AVATAR.width, AVATAR.height],
      quality: 0.7,
    })
    if (!result.canceled) setPickedPhoto(result.assets[0])
  }

  // Uploads the picked photo to avatars/<user id>/ and returns its public URL.
  async function uploadPhoto(photo: ImagePicker.ImagePickerAsset, id: string) {
    const contentType = photo.mimeType ?? 'image/jpeg'
    const extension = contentType.split('/')[1] ?? 'jpg'
    // A new file name each time, so the old photo isn't served from cache.
    const path = `${id}/avatar-${Date.now()}.${extension}`
    const file = await fetch(photo.uri).then((response) => response.arrayBuffer())
    const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType })
    if (error) throw error
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  // Saves the form (uploading a new photo first, if one was picked), then goes back to the profile.
  async function save() {
    if (!userId) return
    setBusy(true)
    // Only send avatar_url when there's a new photo, so saving still works before setup.sql section 5 is run.
    let photoUpdate = {}
    if (pickedPhoto) {
      try {
        photoUpdate = { avatar_url: await uploadPhoto(pickedPhoto, userId) }
      } catch (uploadError) {
        setBusy(false)
        return Alert.alert('Could not upload photo', (uploadError as Error).message)
      }
    }
    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim() || null,
        name: name.trim() || null,
        bio: bio.trim() || null,
        ...photoUpdate,
      })
      .eq('id', userId)
    setBusy(false)

    // Show why it failed, or go back to the profile once saved.
    if (error) {
      // 23505 = unique violation on username
      const message = error.code === '23505' ? 'That username is taken. Try another.' : error.message
      Alert.alert('Could not save profile', message)
    } else {
      router.back()
    }
  }

  // TODO: deleting the auth user needs a server-side function (the app's key can't do it).
  function deleteAccount() {
    Alert.alert('Delete account', 'Account deletion isn’t available yet.')
  }

  // Back to the profile; on web the page may have been opened directly, with nothing to go back to.
  function goBack() {
    if (router.canGoBack()) router.back()
    else router.replace('/profile')
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View style={styles.column}>
        <Text style={styles.title}>Edit profile</Text>
        <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.backButton}>
          <Image source={require('../assets/images/edit-profile/back-button.svg')} style={StyleSheet.absoluteFill} />
        </Pressable>

        {/* Maroon form card, with the photo sitting over its top edge. */}
        <Image source={require('../assets/images/edit-profile/form-card.svg')} style={styles.card} />
        <View style={styles.avatar}>
          {/* The newly picked photo, else the saved one, else the placeholder (with its Figma crop). */}
          {pickedPhoto || avatarUrl ? (
            <Image source={{ uri: pickedPhoto?.uri ?? avatarUrl! }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Image
              source={require('../assets/images/profile/avatar-placeholder.png')}
              style={{ position: 'absolute', top: 0, left: AVATAR_IMAGE.left, width: AVATAR_IMAGE.width, height: AVATAR.height }}
            />
          )}
        </View>
        <Pressable onPress={pickPhoto} accessibilityRole="button" accessibilityLabel="Change profile photo" style={styles.cameraButton}>
          <Image source={require('../assets/images/edit-profile/camera-edit.svg')} style={StyleSheet.absoluteFill} />
        </Pressable>

        {DIVIDER_TOPS.map((top) => (
          <Image key={top} source={require('../assets/images/edit-profile/divider.svg')} style={[styles.divider, { top }]} />
        ))}

        {/* The fields: label on the left, editable value on the right. */}
        <Field top={288} label="Name" value={name} onChangeText={setName} placeholder="Name" />
        <Field top={335} label="@" value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" />
        <Field top={376} label="Bio" value={bio} onChangeText={setBio} placeholder="This is a bio" multiline />
        <Field top={441} label="Phone" value={phone} onChangeText={setPhone} placeholder="+x xxx-xxx-xxxx" keyboardType="phone-pad" />

        <Pressable onPress={save} disabled={busy} accessibilityRole="button" style={styles.saveButton}>
          <Image source={require('../assets/images/edit-profile/save-pill.svg')} style={StyleSheet.absoluteFill} />
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>

        <Pressable onPress={deleteAccount} accessibilityRole="button" style={styles.deleteButton}>
          <Image source={require('../assets/images/edit-profile/delete-pill.svg')} style={StyleSheet.absoluteFill} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

// One form row on the card; `top` is its Figma position in the column.
function Field({
  top,
  label,
  multiline,
  ...input
}: {
  top: number
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  multiline?: boolean
  autoCapitalize?: 'none'
  keyboardType?: 'phone-pad'
}) {
  return (
    <View style={[styles.row, { top }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        multiline={multiline}
        accessibilityLabel={label === '@' ? 'Username' : label}
        placeholderTextColor={editProfileColors.placeholder}
        style={[styles.value, multiline && styles.multilineValue]}
      />
    </View>
  )
}

//assets, buttons, and text
const styles = StyleSheet.create({
  // Page background and the 376pt centered column everything is positioned in.
  screen: { flex: 1, backgroundColor: profileColors.surface },
  column: { width: COLUMN.width, height: COLUMN.height, alignSelf: 'center' },
  title: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    fontFamily: fonts.jostBold,
    fontSize: 24,
    color: editProfileColors.card,
    textAlign: 'center',
  },
  // Round maroon back arrow, left of the title.
  backButton: { position: 'absolute', left: 21, top: 28, width: 42, height: 42 },
  card: { position: 'absolute', left: CARD.left, top: CARD.top, width: CARD.width, height: CARD.height },
  avatar: {
    position: 'absolute',
    left: AVATAR.left,
    top: AVATAR.top,
    width: AVATAR.width,
    height: AVATAR.height,
    borderRadius: 5,
    overflow: 'hidden',
  },
  // camera icon's SVG and round background
  cameraButton: { position: 'absolute', left: 225, top: 217, width: 44, height: 44 },
  divider: { position: 'absolute', left: 20, width: 336.001, height: 1 },
  // A label and its value share one row; multi-line bio
  row: { position: 'absolute', left: ROW.left, width: ROW.width, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  label: { fontFamily: fonts.monoBold, fontSize: 16, lineHeight: ROW.height, color: editProfileColors.label },
  value: {
    flex: 1,
    padding: 0,
    minHeight: ROW.height,
    fontFamily: fonts.mono,
    fontSize: 16,
    lineHeight: ROW.height,
    color: editProfileColors.value,
    textAlign: 'right',
  },
  multilineValue: { height: 44, textAlignVertical: 'top' },
  // Mint "Save Changes" pill on the card, and the red "Delete Account" bar below it.
  saveButton: { position: 'absolute', left: 39, top: 509, width: 301, height: 50, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontFamily: fonts.jostBold, fontSize: 16, color: editProfileColors.saveText },
  deleteButton: { position: 'absolute', left: 67, top: 663, width: 243, height: 26, alignItems: 'center', justifyContent: 'center' },
  deleteText: { fontFamily: fonts.jostBold, fontSize: 16, color: editProfileColors.deleteText },
})
