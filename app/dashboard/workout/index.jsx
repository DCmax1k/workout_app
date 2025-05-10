import { Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import BlueButton from '../../../components/BlueButton'
import { useUserStore } from '../../../stores/useUserStore'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import StartWorkout from '../../../components/workout/StartWorkout'
import rightArrow from '../../../assets/icons/rightArrow.png'
import { generateUniqueId } from '../../../util/uniqueId'
import WorkoutDescription from '../../../components/workout/WorkoutDescription'

const IndexWorkout = () => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const workouts = user.savedWorkouts;
    const workoutsInRotation = user.schedule.rotation.filter(id => id !== "0").length;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const openSchedule = () => {
        // Open schedule view
        router.push('/dashboard/workout/schedule');
    }

    const openWorkout = (workout) => {
      setSelectedWorkout(workout);
      setModalVisible(true);
    }

    const createNewWorkout = () => {
      const newWorkoutData = {name: "New workout", id: generateUniqueId(), exercises: [] };
      updateUser({editActiveWorkout: newWorkoutData});
      router.push("/editworkout");
    }

    const truncate = (text, maxLength) =>
      text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <ThemedView  style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20,  textAlign: 'center'}}>Workout</ThemedText>
          <View style={{padding: 20}}>
            
            <Spacer height={20} />

            <BlueButton title={"Schedule Rotation"} showRight={true} subtitle={`${workoutsInRotation} workout${workoutsInRotation === 1 ? '':"s"} in rotation`} onPress={openSchedule} style={{marginBottom: 40}} />

            <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>My Workouts</ThemedText>
            <BlueButton title={"Create a new workout"} onPress={createNewWorkout} style={{marginBottom: 20}} />
            
          </View>
            
            <View style={{paddingHorizontal: 20}}>
              {workouts.map((workout, i) => {
                return(
                <Pressable style={[styles.selectWorkout, styles.boxShadow]} onPress={() => openWorkout(workout)} key={workout.id+""+i}>
                  <View style={styles.linearGradient}>
                    <View style={{width: "80%"}}>
                      <ThemedText style={{fontSize: 17, fontWeight: 700}} title={true}>{truncate(workout.name, 25)}</ThemedText>
                      <WorkoutDescription workout={workout} />
                    </View>

                    <View style={[styles.boxShadow, {shadowRadius: 5, backgroundColor: "#546FDB", height: 40, width: 40, borderRadius: 99999, justifyContent: "center", alignItems: "center"}]}>
                      <View style={{backgroundColor: "#3D52A6", height: 35, width: 35, borderRadius: 99999, justifyContent: "center", alignItems: "center"}}>
                        <Image style={{height: 20, width: 20}} source={rightArrow} />
                      </View>
                    </View>
                    
                  </View>
                </Pressable>
                
              )})}
            </View>
            

            {workouts.length === 0 ? (
              <ThemedText style={{textAlign: "center"}}>
                No workouts
              </ThemedText>
            ) : (null)}
            

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

export default IndexWorkout

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // padding: 20,
    },
    selectWorkout: {
      width: '100%',
      
    },
    linearGradient: {
      flex: 1,
      height: 80,
      borderRadius: 15,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      backgroundColor: "#2A2A2A",
    },
    boxShadow: {
      shadowColor: "black",
      shadowOffset: {
        width: -5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 2,

    }
  })