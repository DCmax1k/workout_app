import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, Slot, Stack, useRouter } from 'expo-router'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Colors } from '../../../constants/Colors'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import NotificationCard from '../../../components/NotificationCard'

const Home = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [username, setUsername] = useState(user.username);

  const clearUserData = () => {
    // Clear user data
    setUser('');
    router.replace("/login")
  }

  return user ? (
    <ThemedView style={styles.container}> 
      <SafeAreaView style={{flex: 1}} >
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{paddingBottom: 80}}>
          <View style={styles.welcomeCont}>
            <View>
              <Text style={{color: Colors.primaryOrange, fontSize: 15}} >Welcome back,</Text>
              <ThemedText title={true} style={{fontSize: 25, fontWeight: 700}}>{username}</ThemedText>
            </View>
            <View>
              {/* Profile Icon */}
              <BlueButton onPress={clearUserData} title={"[DEV] REST USER"} style={{marginLeft: 20}} />
            </View>
          </View>

          <Spacer />

          <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Quick start</ThemedText>
          <BlueButton onPress={() => router.replace('/dashboard/workout')} title={"Go to My Workouts"} />
          <ThemedText style={{fontSize: 10, paddingVertical: 10, textAlign: 'center'}}>or</ThemedText>
          <BlueButton onPress={() => Alert.alert("Starting workout")} title={"Start an empty workout"} />

          <Spacer />
          <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Activity</ThemedText>
          <NotificationCard header={"3 min ago"} title={"User2 started a workout"} subtitle={"Chest and shoulders"} />
        </ScrollView>

      </SafeAreaView>
      


    </ThemedView>
  ) : (
    <Redirect href="/login" />
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeCont: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 40,
  }
  
})