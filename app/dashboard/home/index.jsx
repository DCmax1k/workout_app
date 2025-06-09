import { Alert, Button, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { LinearGradient } from 'expo-linear-gradient'
import StartWorkout from '../../../components/workout/StartWorkout'
import { Exercises } from '../../../constants/Exercises'
import WorkoutDescription from '../../../components/workout/WorkoutDescription'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { generateUniqueId } from '../../../util/uniqueId'
import playCircle from '../../../assets/icons/playCircle.png'

const IndexHome = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const { openSheet } = useBottomSheet();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  //const continuedWorkout = {name: 'test', id: "32", exercises: []}
  const continuedWorkout = user.schedule.rotation.length > 0 ? user.schedule.rotation[user.schedule.currentIndex] === "0" ? {name: "Rest Day", id: "0",} : user.savedWorkouts.find(w => w.id === user.schedule.rotation[user.schedule.currentIndex]) : null;

  const clearUserData = () => {
    // Clear user data
    setUser(null);
  }
  const changeUsernameTest = () => {
    // Change username test
    //setUsername("NewUsername")
    updateUser({username: "User1"});
  }

  const openWorkout = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  }

  const rotateNext = () => {
    const current = user.schedule.currentIndex; 
    let newIndex = current+1;
    if (newIndex >= user.schedule.rotation.length) {
      newIndex = 0;
    }
    updateUser({schedule: {...user.schedule, currentIndex: newIndex}})
  }

  const startEmptyWorkout = (bypassCheck = false) => {
    if (bypassCheck === false && user.activeWorkout !== null) {
          // Make sure active workout is visible
          openSheet(0);
          //Alert
        Alert.alert(
            "Workout in progress",
            "If you start a new workout, your current one will be discarded",
            [
                {text: "Start new workout", style: "destructive", onPress: () => startEmptyWorkout(true)},
                {text: "Do Nothing", style: "cancel"}
            ]
        )
        return;
    } 

    const clonedWorkout = {
      name: "New workout",
      exercises: [],
      startTime: Date.now(),
      id: generateUniqueId(),
    };
    updateUser({activeWorkout: clonedWorkout});
    openSheet(1);
}

  const truncate = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  let isThereWorkout = (continuedWorkout !== null && continuedWorkout.id !== "0") ? "yes" : (continuedWorkout !== null && continuedWorkout.id === "0") ? "rest" : "none";

  return (
    <ThemedView style={styles.container}> 
      <SafeAreaView style={{flex: 1}} >
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{paddingBottom: 120}}>
          {/* <BlueButton onPress={clearUserData} title={"[BETA] RESET USER DATA"} style={{marginLeft: 20}} /> */}
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


          {/* If a schedule, show next in schedule. Else, show create a schedule */}
          <LinearGradient style={[styles.gradientView]} colors={['#262C47', '#473326']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
              <View style={{width: "100%"}}>
                <Text style={{fontSize: 17, color: "white", fontWeight: 700}}>{isThereWorkout === "yes" ? truncate(continuedWorkout.name, 30) : isThereWorkout === "rest" ? "Rest Day" : "Create a schedule" }</Text>
                {isThereWorkout === "yes" ? (
                  <WorkoutDescription style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}} workout={continuedWorkout} />
                ) : (
                  <Text style={{fontSize: 13, color: "#E4E4E4", fontWeight: 400}}>{isThereWorkout === "rest" ? "Click next for your next workout!" : "Add or create workouts to add!"}</Text>
                )}
                
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", width: "100%"}}>
                <Pressable style={{padding: 10, backgroundColor: "#546FDB", borderRadius: 10, marginRight: 10}} onPress={isThereWorkout==="yes" ?  () => openWorkout(continuedWorkout) : isThereWorkout==="rest" ? rotateNext : () => router.push('/dashboard/workout') }>
                  <Text style={{fontSize: 14, color: "white"}}>{isThereWorkout==="yes" ?  "Open workout" : isThereWorkout==="rest" ? "Next" : "Go to workouts"}</Text>
                </Pressable>
                {isThereWorkout==="yes" && (
                  <Pressable onPress={rotateNext} style={{padding: 5, backgroundColor: "#656565", borderRadius: 10}}>
                    <Text style={{fontSize: 12, color: "white"}}>Skip</Text>
                  </Pressable>
                )}
                
              </View>
            </LinearGradient>

          <ThemedText style={{fontSize: 10, paddingVertical: 10, textAlign: 'center'}}>or</ThemedText>
          <BlueButton onPress={() => startEmptyWorkout()} title={"Start an empty workout"} icon={playCircle}/>

          <Spacer />
          <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Activity</ThemedText>
          <NotificationCard header={"3 min ago"} title={"User2 started a workout"} subtitle={"Chest and shoulders"} />
        </ScrollView>

      </SafeAreaView>
      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        {selectedWorkout !== null ? (
        <StartWorkout workout={selectedWorkout} setModalVisible={setModalVisible} />
        ) : null}
      </Modal>


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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  gradientView: {
    width: '100%',
    height: 130,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.primaryBlue,
    borderWidth: 2,
  }
  
})