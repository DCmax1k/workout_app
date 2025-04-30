import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import BlueButton from '../../../components/BlueButton'
import { useUserStore } from '../../../stores/useUserStore'
import { router } from 'expo-router'

const IndexWorkout = () => {
    const user = useUserStore((state) => state.user);

    const openSchedule = () => {
        // Open schedule view
        router.push('/dashboard/workout/schedule');
    }

  return (
    <ThemedView  style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20,  textAlign: 'center'}}>Workout</ThemedText>

            <Spacer height={20} />

            <BlueButton title={"Schedule Rotation"} subtitle={`${user.schedule.rotation.length} workout${user.savedWorkouts.length === 1 ? '':"s"} in rotation`} onPress={openSchedule} style={{marginBottom: 40}} />

            <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>My Workouts</ThemedText>
            <BlueButton title={"Create a new workout"} onPress={() => {}} style={{marginBottom: 20}} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export default IndexWorkout

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    
  })