import { Alert, Button, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Link, Slot, Stack, useRouter } from 'expo-router'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import { Colors } from '../../../constants/Colors'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import BlueButton from '../../../components/BlueButton'
import NotificationCard from '../../../components/NotificationCard'

import profileIcon from '../../../assets/icons/profileIcon.png'
import search from '../../../assets/icons/search.png'

const IndexHome = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const clearUserData = () => {
    // Clear user data
    setUser('');
  }
  const changeUsernameTest = () => {
    // Change username test
    //setUsername("NewUsername")
    updateUser({username: "User1"});
  }

  return (
    <ThemedView style={styles.container}> 
      <SafeAreaView style={{flex: 1}} >
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{paddingBottom: 80}}>
          <BlueButton onPress={clearUserData} title={"[DEV] REST USER"} style={{marginLeft: 20}} />
          {/* <BlueButton onPress={changeUsernameTest} title={"Change username"} style={{marginLeft: 20}} /> */}
          <View style={styles.welcomeCont}>
            <View>
              <Text style={{color: Colors.primaryOrange, fontSize: 15}} >Welcome back,</Text>
              <ThemedText title={true} style={{fontSize: 25, fontWeight: 700}}>{user.username}</ThemedText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* Profile Icon */}
              <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/search')} >
                  <Image style={{width: "70%", height: "70%"}} source={search} />
              </Pressable>
              <Pressable style={styles.actionButtonCont} onPress={() => router.push('/dashboard/home/profile')}>
                  <Image style={{width: "100%", height: "100%"}} source={profileIcon} />
              </Pressable>
              
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
  )
}

export default IndexHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeCont: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonCont: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  
})