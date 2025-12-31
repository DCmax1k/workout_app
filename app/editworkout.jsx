import { Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemedView from '../components/ThemedView'
import { useUserStore } from '../stores/useUserStore'
import { Colors } from '../constants/Colors'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import pencil from '../assets/icons/pencil.png'
import { Exercises } from '../constants/Exercises'
import EditExercise from '../components/workout/EditExercise'
import BlueButton from '../components/BlueButton'
import Spacer from '../components/Spacer'
import AddExercise from '../components/workout/AddExercise'
import ActionMenu from '../components/ActionMenu'
import trashIcon from '../assets/icons/trash.png'

import { workoutToSimple } from '../util/workoutToSimple'
import ConfirmMenu from '../components/ConfirmMenu'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition, SlideInDown, SlideOutDown, useEvent } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import getAllExercises from '../util/getAllExercises'
import deepEqual from '../util/deepEqual'
import { generateUniqueId } from '../util/uniqueId'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import sendData from '../util/server/sendData'
import { useBottomSheet } from '../context/BottomSheetContext'
import SwipeToDelete from '../components/SwipeToDelete'


const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const EditWorkout = () => {
  const {showAlert} =  useBottomSheet();

  const workoutNameInputRef = useRef(null);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const workout = user.editActiveWorkout;
  if (workout.startTime) delete workout.startTime;
  const exercises = workout.exercises;
  //const allExercises = [...user.createdExercises, ...Exercises];
  const allExercises = getAllExercises(user);

  const params = useLocalSearchParams();
  const workoutBeforeEdits = params.workout ? JSON.parse(params.workout) : {};
  const autoSelectName = params.autoSelectName ?? false;
  useEffect(() => {
    let timeout;

    if (autoSelectName && workoutNameInputRef.current) {
      timeout = setTimeout(() => {
        workoutNameInputRef.current.focus();
      }, 510);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [autoSelectName]);

  // Prevent swipe out nav
  const navigation = useNavigation();
  const blockNav = useRef(false);
  useEffect(() => {
    blockNav.current = true;
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!blockNav.current) return; // allow navigation if unblocked

      // Otherwise, block it
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);
  const handleGoBack = () => {
    blockNav.current = false;
    //navigation.goBack(); 
    router.back();
  };

  const [isDragging, setIsDragging] = useState(false);

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

  const saveWorkoutServer = async (workout) => {
    const response = await sendData('/dashboard/saveworkout', {workout, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") {
      showAlert(response.message, false);
      return;
    }
  }

  const requestSaveWorkout = async () => {
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
    await saveWorkoutServer(w);
    //router.back();
    handleGoBack();
  }

  const updateWorkoutName = (value) => {
    updateWorkout({name: value});
  }
  const handleEndEditting = () => {
    if (!workout.name) updateWorkoutName("New Workout");
  }

  const addExercises = (exerciseIds) => { // [exerciseId,]
    const completeExercises = exerciseIds.map(id => {
      const finding = allExercises.find(ex => ex.id === id);
      //if (finding.sets) return finding;
      const prefs = user.extraDetails.preferences;
      const newExercise = {...finding, sets: [], uniqueId: generateUniqueId(), }; // unique id for sorting purposes, and global unit
      if (newExercise.tracks.includes('weight') || newExercise.tracks.includes('weightPlus') || newExercise.tracks.includes('mile')) {
        newExercise.unit = newExercise.tracks.includes('mile') ? prefs.distanceUnit : prefs.liftUnit;
      }
      return newExercise;
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
  const removeWorkoutServer = async (workoutID) => {
      const response = await sendData("/dashboard/removeworkout", {workoutID, jsonWebToken: user.jsonWebToken});
      if (response.status !== "success") {
          showAlert(response.message, false);
          return;
      }
  }
  const deleteWorkout = (workoutID) => {
    removeWorkoutServer(workoutID);
    const userWorkouts = user.savedWorkouts;
    const workoutToDeleteIndex = userWorkouts.findIndex(w => w.id === workoutID);
    if (workoutToDeleteIndex >= 0) {
      // Delete workout from saved workouts, and from rotation if in rotation
      userWorkouts.splice(workoutToDeleteIndex, 1);
      removeFromRotation(workoutID);
    }
    //router.back();
    handleGoBack();
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

  const cancelEdit = () => {
    // Check if edits were made
    if ( deepEqual(workoutBeforeEdits, workout) ) {
      handleGoBack();
    } else {
      setConfirmMenuData({
        title: "Leave without saving?",
        subTitle: "Any changes will be discarded.",
        subTitle2: "This action cannot be undone.",
        option1: "Don't save and leave",
        option1color: "#DB5454",
        option2: "Stay",
        confirm: handleGoBack,
      });
      setConfirmMenuActive(true);
    }
  }

  const exerciseFlatlistData = exercises.map((ex, i) => {
    if (!ex.uniqueId) {
      ex.uniqueId = generateUniqueId(); // only assign if missing
    }
    return {
      key: ex.uniqueId,
      index: i,
      width: screenWidth - 40,
      exercise: {...ex},
    }
  })
  const setExerciseFlatlistData = (data) => {
    const newExercises = data.map(item => item.exercise);
    updateWorkout({exercises: newExercises});
  }

  

  return (
    // <PaperProvider>
      <ThemedView style={{flex: 1, padding: 20}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        
        <SafeAreaView style={{flex: 1, marginBottom: -50}}>

          <View style={[styles.actionButtons]}>
              <View>
                <Pressable onPress={cancelEdit} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#4B4B4B", borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Cancel</Text>
                  </Pressable>
              </View>
              <View>
                  <Pressable onPress={requestSaveWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primaryBlue, borderRadius: 10, }}>
                      <Text style={{fontSize: 15, color: "white",}}>Save</Text>
                  </Pressable>
              </View>
          </View>


          <DraggableFlatList
              ListHeaderComponent={
                <>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20}}>
                    <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center"}} onPress={() => {if (workoutNameInputRef.current) {workoutNameInputRef.current.focus()}}}>
                      <Image style={{height: 15, width: 15, marginRight: 10}} source={pencil} />
                    </Pressable>
                    
                    <TextInput selectTextOnFocus ref={workoutNameInputRef} onChangeText={updateWorkoutName} onEndEditing={handleEndEditting} value={workout.name} style={styles.workoutNameInput} />
                    <ActionMenu data={[{title: "Delete Workout", icon: trashIcon, onPress: requestDeleteWorkout, color: "#FF6C6C"}]} />
                  </View>
                </>
              }
              style={{width: screenWidth, marginHorizontal: -20}}
              contentContainerStyle={{paddingBottom: 350}}
              showsVerticalScrollIndicator={false}
              // nestedScrollEnabled={true}
              data={exerciseFlatlistData}
              onDragBegin={() => setIsDragging(true)}
              onDragEnd={({data}) => {setExerciseFlatlistData(data); setIsDragging(false)}}
              keyExtractor={(item) => item.key}
              renderItem={({item, drag, isActive}) => {
                return (
                    <ScaleDecorator key={item.key}>
                      <View key={item.key} style={{width: item.width,}}>

                        <SwipeToDelete style={{width: screenWidth}} openedRight={() => removeExercise(item.index)} >
                          <View style={{ width: screenWidth-20, alignSelf: "center"}}>
                            <EditExercise
                            key={item.key}
                            exercise={item.exercise}
                            updateExercise={updateExercise}
                            removeExercise={() => removeExercise(item.index)}
                            index={item.index}
                            drag={drag}
                            dragActive={isActive}
                            />
                          </View>
                        </SwipeToDelete>

                      </View>
                    </ScaleDecorator>
                  
                )
              }}

              ListFooterComponent={
                <>
                  <Spacer height={20} />

                  <Animated.View layout={LinearTransition} style={{marginHorizontal: 20}} >
                    <BlueButton color={Colors.primaryOrange} title={"Add Exercise"} onPress={() => setExerciseModal(true)} />
                  </Animated.View>
                </>
              }
          >
            
          </DraggableFlatList>

        </SafeAreaView>

            {/* {Platform.OS === 'ios' ? (
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
                ) : null)} */}

                {/* Switch to not using modal for keyboard dismiss button to show */}
        {(exerciseModal === true ? (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} notModal={true} />
                    </Animated.View>
                ) : null)}
        
      </ThemedView>
    // </PaperProvider>
    
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