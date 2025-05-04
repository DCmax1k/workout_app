import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import { useUserStore } from '../stores/useUserStore'
import TitleWithBack from '../components/TitleWithBack'
import { Colors } from '../constants/Colors'
import { router } from 'expo-router'
import pencil from '../assets/icons/pencil.png'
import { Exercises } from '../constants/Exercises'
import EditExercise from '../components/workout/EditExercise'
import BlueButton from '../components/BlueButton'
import Spacer from '../components/Spacer'
import AddExercise from '../components/workout/AddExercise'

const EditWorkout = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const workout = user.editActiveWorkout;
  const exercises = workout.exercises.map(ex => {
    const usersInfo = user.createdExercises.find(e => e.id === ex.id);
    if (usersInfo) {
      return {
        ...ex,
        ...usersInfo
      }
    }
    const info = Exercises.find(e => e.id === ex.id);
    return {
      ...ex,
      ...info
    }
  });
  const allExercises = [...user.createdExercises, ...Exercises];

  const [exerciseModal, setExerciseModal] = useState(false);

  const updateWorkout = (updates) => {
    updateUser({editActiveWorkout: {...workout, ...updates}});
  }
  const updateExercise = (exerciseIndex, newExercise) => {
    const ex = workout.exercises;
    ex[exerciseIndex] = newExercise;
    updateWorkout({exercises: ex})
  }

  const saveWorkout = () => {
    // Last minute changes to workout before save
    if (!workout.name) workout.name = "New workout";
    const newExercises = workout.exercises.map(ex => {
      return {
        id: ex.id,
        sets: ex.sets,
      }
    });
    workout.exercises = newExercises;
    // Find saved workout
    const savedWorkouts = user.savedWorkouts;
    const workoutIndex = savedWorkouts.findIndex(wk => wk.id === workout.id);
    // Set saved workout
    savedWorkouts[workoutIndex] = workout;
    updateUser({savedWorkouts});
    router.back();
    // Contact db
  }

  const updateWorkoutName = (value) => {
    updateWorkout({name: value});
  }
  const handleEndEditting = () => {
    if (!workout.name) updateWorkoutName("New workout");
  }

  const addExercises = (exerciseIds) => { // [exerciseId,]
    const completeExercises = exerciseIds.map(id => {
      const finding = allExercises.find(ex => ex.id === id);
      if (finding.sets) return finding;
      else return {...finding, sets: []}
    });
    const exercisesAddedTo = [...exercises, ...completeExercises];
    updateWorkout({exercises: exercisesAddedTo});

  }

  return (
    <ThemedView style={{flex: 1, padding: 20}}>
      <SafeAreaView style={{flex: 1}}>

        <View style={styles.actionButtons}>
            <View>
              <Pressable onPress={() => {router.back()}} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#4B4B4B", borderRadius: 10, }}>
                    <Text style={{fontSize: 15, color: "white",}}>Cancel</Text>
                </Pressable>
            </View>
            <View>
                <Pressable onPress={saveWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primaryBlue, borderRadius: 10, }}>
                    <Text style={{fontSize: 15, color: "white",}}>Save</Text>
                </Pressable>
            </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
            <TextInput onChangeText={updateWorkoutName} onEndEditing={handleEndEditting} value={workout.name} style={styles.workoutNameInput} />
          </View>

          {exercises.map((exercise, i) => (
            <EditExercise key={exercise.id+""+i} exercise={exercise} updateExercise={updateExercise} index={i} />
          ))}

          <Spacer height={20} />

          <BlueButton title={"Add exercise"} onPress={() => setExerciseModal(true)} />

        </ScrollView>

        



      </SafeAreaView>
      <Modal
            visible={exerciseModal}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={() => {
              setExerciseModal(false)
            }}
        >
            <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} />
      </Modal>
      
    </ThemedView>
  )
}

export default EditWorkout

const styles = StyleSheet.create({
  actionButtons: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutNameInput: {
    fontSize: 23,
    color: "white",
    flex: 1,
    fontWeight: 700
  }
})