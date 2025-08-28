import { Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ThemedView from '../components/ThemedView'
import { useUserStore } from '../stores/useUserStore'
import { Colors } from '../constants/Colors'
import { router } from 'expo-router'
import pencil from '../assets/icons/pencil.png'
import { Exercises } from '../constants/Exercises'
import EditExercise from '../components/workout/EditExercise'
import BlueButton from '../components/BlueButton'
import Spacer from '../components/Spacer'
import AddExercise from '../components/workout/AddExercise'
import { PaperProvider } from 'react-native-paper'
import ActionMenu from '../components/ActionMenu'
import trashIcon from '../assets/icons/trash.png'
import { workoutToSimple } from '../util/workoutToSimple'
import ConfirmMenu from '../components/ConfirmMenu'
import Animated, { LinearTransition, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import SwipeToDelete from '../components/SwipeToDelete'
import { SafeAreaView } from 'react-native-safe-area-context'
import getAllExercises from '../util/getAllExercises'

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const EditWorkout = () => {
  const workoutNameInputRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const workout = user.editActiveWorkout;
  const exercises = workout.exercises;
  //const allExercises = [...user.createdExercises, ...Exercises];
  const allExercises = getAllExercises(user);

  
  const [exerciseModal, setExerciseModal] = useState(false);
  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState({
          title: "The title",
          subTitle: "The description for the confirmation",
          subTitle2: "Another one here",
          option1: "Update",
          
          option2: "Cancel",
          confirm: () => {},
      });

  const updateWorkout = (updates) => {
    updateUser({editActiveWorkout: {...workout, ...updates}});
  }
  const updateExercise = (exerciseIndex, newExercise) => {
    const ex = workout.exercises;
    ex[exerciseIndex] = newExercise;
    updateWorkout({exercises: ex})
  }
  const removeExercise = (exerciseIndex) => {
    const newExercises = workout.exercises;
    newExercises.splice(exerciseIndex, 1);
    updateWorkout({exercises: newExercises});
  }

  const requestSaveWorkout = () => {
    const w = workoutToSimple(workout);
    // Save simplified workout
    const savedWorkouts = user.savedWorkouts;
    const workoutIndex = savedWorkouts.findIndex(wk => wk.id === w.id);
    if (workoutIndex < 0) {
      // If not found, unshift workout
      savedWorkouts.unshift(w);
    } else {
      // If found, set saved workout
      savedWorkouts[workoutIndex] = w;
    }
    updateUser({savedWorkouts: [...savedWorkouts]});
    router.back();
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

  // COPIED TO index\workout
  const removeFromRotation = (workoutId) => {
    let schedule = user.schedule;
    const newRotation = user.schedule.rotation.filter(id => id !== workoutId);
    schedule = {...schedule, rotation: newRotation}
    schedule = {...schedule, currentIndex: 0}
    updateUser({schedule});
  }
  const deleteWorkout = (workoutID) => {
    const userWorkouts = user.savedWorkouts;
    const workoutToDeleteIndex = userWorkouts.findIndex(w => w.id === workoutID);
    if (workoutToDeleteIndex >= 0) {
      // Delete workout from saved workouts, and from rotation if in rotation
      userWorkouts.splice(workoutToDeleteIndex, 1);
      removeFromRotation(workoutID);
    }
    router.back();
  } // end copied

  const requestDeleteWorkout = () => {
    // Alert.alert(
    //     "Delete workout?",
    //     "",
    //     [
    //         {text: "Cancel", style: "cancel"},
    //         {text: "Delete", onPress: deleteWorkout}
    //     ]
    // );
    setConfirmMenuData({
        title: "Delete workout?",
        subTitle: "Are you sure you would like to delete this workout?",
        subTitle2: "This action cannot be undone.",
        option1: "Delete workout",
        option1color: "#DB5454",
        option2: "Go back",
        confirm: () => deleteWorkout(workout.id),
    });
    setConfirmMenuActive(true);
  }

  return (
    <PaperProvider>
      <ThemedView style={{flex: 1, padding: 20}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1, marginBottom: -50}}>

          <View style={styles.actionButtons}>
              <View>
                <Pressable onPress={() => {router.back()}} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#4B4B4B", borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Cancel</Text>
                  </Pressable>
              </View>
              <View>
                  <Pressable onPress={requestSaveWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primaryBlue, borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Save</Text>
                  </Pressable>
              </View>
          </View>
          <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 350, }}>

            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
              <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (workoutNameInputRef.current) {workoutNameInputRef.current.focus()}}}>
                <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
              </Pressable>
              
              <TextInput selectTextOnFocus ref={workoutNameInputRef} onChangeText={updateWorkoutName} onEndEditing={handleEndEditting} value={workout.name} style={styles.workoutNameInput} />
              <ActionMenu data={[{title: "Delete workout", icon: trashIcon, onPress: requestDeleteWorkout,}]} />
            </View>

            {exercises.map((exercise, i) => (
                // <SwipeToDelete key={exercise.id+""+i} openedRight={() => removeExercise(i)} >
                <Animated.View key={exercise.id+""+i} layout={LinearTransition}>
                  <EditExercise key={exercise.id+""+i} exercise={exercise} updateExercise={updateExercise} removeExercise={() => removeExercise(i)} index={i} />
                </Animated.View>
                  
                // </SwipeToDelete>

              
            ))}

            <Spacer height={20} />

            <Animated.View layout={LinearTransition} >
              <BlueButton title={"Add exercise"} onPress={() => setExerciseModal(true)} />
            </Animated.View>
            

          </Animated.ScrollView>
        </SafeAreaView>

            {Platform.OS === 'ios' ? (
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
            ) : (exerciseModal === true ? (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} notModal={true} />
                    </Animated.View>
                ) : null)}
        
        
      </ThemedView>
    </PaperProvider>
    
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