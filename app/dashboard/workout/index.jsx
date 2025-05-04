import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import BlueButton from '../../../components/BlueButton'
import { useUserStore } from '../../../stores/useUserStore'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import StartWorkout from '../../../components/workout/StartWorkout'


const IndexWorkout = () => {
    const user = useUserStore((state) => state.user);
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

    const truncate = (text, maxLength) =>
      text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <ThemedView  style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20,  textAlign: 'center'}}>Workout</ThemedText>

            <Spacer height={20} />

            <BlueButton title={"Schedule Rotation"} showRight={true} subtitle={`${workoutsInRotation} workout${workoutsInRotation === 1 ? '':"s"} in rotation`} onPress={openSchedule} style={{marginBottom: 40}} />

            <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>My Workouts</ThemedText>
            <BlueButton title={"Create a new workout"} onPress={() => {}} style={{marginBottom: 20}} />

            {workouts.map((workout, i) => (
              <Pressable style={[styles.selectWorkout, styles.boxShadow]} onPress={() => openWorkout(workout)} key={workout.id+""+i}>
                <LinearGradient style={styles.linearGradient} colors={['#262C47', '#473326']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                  <View>
                    <ThemedText style={{fontSize: 17, fontWeight: 700}} title={true}>{truncate(workout.name, 30)}</ThemedText>
                    <ThemedText>{workout.exercises.length} exercise{workout.exercises.length===1 ? '':'s'}</ThemedText>
                  </View>
                  
                </LinearGradient>
              </Pressable>
              
            ))}

            {workouts.length === 0 ? (
              <ThemedText>
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
      padding: 20,
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
    },
    boxShadow: {
      shadowColor: "black",
      shadowOffset: {
        width: -3,
        height: 3,
      },
      shadowOpacity: 1,
      shadowRadius: 2,

    }
  })