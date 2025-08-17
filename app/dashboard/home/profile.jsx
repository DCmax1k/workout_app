import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import Spacer from '../../../components/Spacer'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const updateUser = useUserStore((state) => state.updateUser);

    const clearUserData = () => {
      // Clear user data
      setUser(null);
    }
    return (
      <ThemedView style={styles.container}>
          <SafeAreaView style={{flex: 1}} >
              <TitleWithBack title={"Profile"} style={{marginLeft: -20}} />
              <Spacer />
              <BlueButton onPress={clearUserData} title={"Log out"} style={{marginLeft: 20}} />
          </SafeAreaView>
      </ThemedView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    
  })