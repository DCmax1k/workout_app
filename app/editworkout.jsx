import { Alert, Image, Keyboard, KeyboardAvoidingView, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
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
import threeEllipses from '../assets/icons/threeEllipses.png'
import { generateUniqueId } from '../util/uniqueId'
import keyboardIcon from '../assets/icons/keyboard.png'
import { PaperProvider } from 'react-native-paper'
import ActionMenu from '../components/ActionMenu'
import trashIcon from '../assets/icons/trash.png'

const EditWorkout = () => {
  const workoutNameInputRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const workout = user.editActiveWorkout;
  const exercises = workout.exercises;
  // const exercises = workout.exercises.map(ex => {
  //   const usersInfo = user.createdExercises.find(e => {
  //     console.log(e);
  //     return e.id === ex.id
  //   });
  //   if (usersInfo) {
  //     return {
  //       ...ex,
  //       ...usersInfo
  //     }
  //   }
  //   const info = Exercises.find(e => e.id === ex.id);
  //   return {
  //     ...ex,
  //     ...info
  //   }
  // });
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
  const updateCreatedExercise = (exerciseId, newExercise) => {
      const created = user.createdExercises;
      const indexOfEx = created.findIndex(e => e.id === exerciseId);
      created[indexOfEx] = newExercise;
      updateUser({createdExercises: created});
  }

  const saveWorkout = () => {
    // Last minute changes to workout before save
    if (!workout.name) workout.name = "New workout";
    const newExercises = workout.exercises.map(ex => {
      // Find any modified exercises, update their data in createdExercises. Create the exercise if modified id not found
      if (ex.modified) {
        const createdExerciseId = user.createdExercises.findIndex(e => e.id === ex.id);
        if (createdExerciseId < 0) {
          // Didnt find id, so make data, and change id of exercise in workout
          const modifiedExercise = {
              name: ex.name,
              group: ex.group,
              tracks: ex.tracks,
              description: ex.description,
              image: ex.image,
              muscleGroups: ex.muscleGroups,
              difficulty: ex.difficulty,
              previousId: ex.id,
              id: generateUniqueId(),
          };
          const newCreatedExercises = user.createdExercises;
          newCreatedExercises.unshift(modifiedExercise);
          updateUser({createdExercises: newCreatedExercises});

          
          const exerciseIndex = workout.exercises.findIndex(of => of.id === ex.id);
          workout.exercises[exerciseIndex].id = modifiedExercise.id;
        } else {
          // Finds id, so change data
          const {sets, note, ...rest} = ex;
          updateCreatedExercise(ex.id, rest);
        }
      }
      // Set exercises back to simple data
      return {
        id: ex.id,
        sets: ex.sets,
        name: ex.name,
        note: ex.note,
      }
    });
    workout.exercises = newExercises;
    // Find saved workout
    const savedWorkouts = user.savedWorkouts;
    const workoutIndex = savedWorkouts.findIndex(wk => wk.id === workout.id);
    if (workoutIndex < 0) {
      // If not found, unshift workout
      savedWorkouts.unshift(workout);
    } else {
      // If found, set saved workout
      savedWorkouts[workoutIndex] = workout;
    }
    
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

  const deleteWorkout = () => {
    const userWorkouts = user.savedWorkouts;
    const workoutToDeleteIndex = userWorkouts.findIndex(w => w.id === workout.id);
    if (workoutToDeleteIndex >= 0) {
      // Delete workout and go back
      userWorkouts.splice(workoutToDeleteIndex, 1);
      updateUser({savedWorkouts: userWorkouts});
    }
    router.back();
  }
  const requestDeleteWorkout = () => {
    Alert.alert(
        "Delete workout?",
        "",
        [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", onPress: deleteWorkout}
        ]
    );
  }
  const removeExercise = (exerciseId) => {
    const newExercises = workout.exercises.filter(e => e.id !== exerciseId);
    updateWorkout({exercises: newExercises});
  }

  return (
    <PaperProvider>
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, }}>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (workoutNameInputRef.current) {workoutNameInputRef.current.focus()}}}>
              <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
            </Pressable>
            
            <TextInput selectTextOnFocus ref={workoutNameInputRef} onChangeText={updateWorkoutName} onEndEditing={handleEndEditting} value={workout.name} style={styles.workoutNameInput} />
            <ActionMenu data={[{title: "Delete workout", icon: trashIcon, onPress: requestDeleteWorkout,}]} />
          </View>

          {exercises.map((exercise, i) => (
            <EditExercise key={exercise.id+""+i} exercise={exercise} updateExercise={updateExercise} removeExercise={removeExercise} index={i} />
          ))}

          <Spacer height={20} />

          <BlueButton title={"Add exercise"} onPress={() => setExerciseModal(true)} />

        </ScrollView>
      </SafeAreaView>

      <KeyboardAvoidingView style={{position: "absolute", bottom: -50, right: 20, paddingBottom: 10}} behavior='position'>
        <Pressable style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#828282", borderRadius: 10}} onPress={() => Keyboard.dismiss()} >
          <Image style={{height: 30, width: 30, objectFit: 'contain'}} source={keyboardIcon} />
        </Pressable>
      </KeyboardAvoidingView>

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