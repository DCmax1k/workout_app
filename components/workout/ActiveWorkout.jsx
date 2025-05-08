import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Timer from '../Timer'
import Animated from 'react-native-reanimated';
import { useUserStore } from '../../stores/useUserStore';
import { useBottomSheet } from '../../context/BottomSheetContext'
import EditExercise from './EditExercise';
import { PaperProvider } from 'react-native-paper';
import Spacer from '../Spacer';
import AddExercise from './AddExercise';
import BlueButton from '../BlueButton';
import { Exercises } from '../../constants/Exercises';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const screenHeight = Dimensions.get("window").height;

const ActiveWorkout = ({animatedFinishOpacity, animatedHeaderOpacity, sheetOpen, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const {closeSheet} = useBottomSheet();
    const [exerciseModal, setExerciseModal] = useState(false);
    const allExercises = [...user.createdExercises, ...Exercises];

    const workout = user.activeWorkout;
    const exercises = workout.exercises;

    const startTime = workout.startTime;

    const updateWorkout = (updates) => {
        updateUser({activeWorkout: {...workout, ...updates}});
    }

    const updateExercise = (exerciseIndex, newExercise) => {
        const ex = workout.exercises;
        ex[exerciseIndex] = newExercise;
        updateWorkout({exercises: ex})
    }
    const removeExercise = (exerciseId) => {
        const newExercises = workout.exercises.filter(e => e.id !== exerciseId);
        updateWorkout({exercises: newExercises});
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
       <View style={{flex: 1}}>
            <Animated.View style={[{flexDirection: "row", justifyContent: "flex-end", position: "absolute", left: 0, top: 0, width: "100%", zIndex: 1, elevation: 1}, animatedFinishOpacity]}>
                <Pressable onPress={sheetOpen ? closeSheet : null} style={{backgroundColor: "#21863C", paddingVertical: 10, paddingHorizontal: 15, marginRight: 10, borderRadius: 10}}>
                    <Text style={styles.text}>Finish</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[{position: "absolute", width: "100%", alignItems: "center"}, animatedHeaderOpacity]}>
                <Text style={[styles.text, {fontSize: 18, paddingHorizontal: 10, textAlign: "center"}]}>{workout.name}</Text>
                <Timer startTime={startTime} textStyle={{fontSize: 15, color: "#C4C4C4"}} />
            </Animated.View>

            <PaperProvider>
            <BottomSheetScrollView style={{marginTop: 85}} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, }}>
                
                <View style={[{ paddingHorizontal: 10}]}>
                    <Text style={[styles.text, {fontSize: 25}]}>{workout.name}</Text>
                    <Timer startTime={startTime} textStyle={{fontSize: 20, color: "#C4C4C4"}} />
                </View>

                <Spacer height={20} />

                {exercises.map((exercise, i) => (
                    <EditExercise key={exercise.id+""+i} exercise={exercise} updateExercise={updateExercise} removeExercise={removeExercise} index={i} activeWorkoutStyle={true} />
                ))}

                <Spacer height={20} />

                <BlueButton title={"Add exercise"} onPress={() => setExerciseModal(true)} />
            </BottomSheetScrollView>
            </PaperProvider>
            
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
            ):(
                <View style={{position: "absolute", top: exerciseModal ? 0 : screenHeight, left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}}>
                    <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} notModal={true} />
                </View>
            )}
            
        </View> 
    
  );
}

export default ActiveWorkout

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: 600,
    }
})