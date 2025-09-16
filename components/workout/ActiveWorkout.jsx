import { Alert, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Timer from '../Timer'
import Animated, { LinearTransition, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useUserStore } from '../../stores/useUserStore';
import { useBottomSheet } from '../../context/BottomSheetContext'
import EditExercise from './EditExercise';
import { PaperProvider, Portal } from 'react-native-paper';
import Spacer from '../Spacer';
import AddExercise from './AddExercise';
import BlueButton from '../BlueButton';
import { Exercises } from '../../constants/Exercises';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ConfirmMenu from '../ConfirmMenu';
import { truncate } from '../../util/truncate';

const lbsToKgs = (lbs) => {
    return 0.453592*lbs;
}

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const ActiveWorkout = ({animatedFinishOpacity, animatedHeaderOpacity, currentPosition, ...props}) => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);
    const {closeSheet, showFinishWorkout} = useBottomSheet();
    const [exerciseModal, setExerciseModal] = useState(false);
    const allExercises = [...user.createdExercises, ...Exercises];

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
        title: "The title",
        subTitle: "The description for the confirmation",
        subTitle2: "Another one here",
        option1: "Update",
        option2: "Cancel",
        confirm: () => {},
    });

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
    const removeExercise = (exerciseIndex) => {
        const newExercises = workout.exercises;
        newExercises.splice(exerciseIndex, 1);
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

    const requestFinish = () => {

        setConfirmMenuData({
                title: "Finish workout?",
                subTitle: "Are you sure you want to finish this workout?",
                option1: "Finish!",
                option1color: "#21863C",
                option2: "Go back",
                confirm: finish,
            });
            setConfirmMenuActive(true);
            return;
    }

    const updateWorkoutName = (value) => {
        updateWorkout({name: value});
      }
    const handleEndEditting = () => {
        if (!workout.name) updateWorkoutName("New workout");
    }

    const cancelWorkout = (confirmation = false, message="All progress will be lost") => {
        if (confirmation) {
            setConfirmMenuData({
                title: "Cancel workout?",
                subTitle: message,
                option1: "Cancel Workout",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: cancelWorkout,
            });
            setConfirmMenuActive(true);
            return;
        }
        closeSheet();
        setTimeout(() => {
            updateUser({activeWorkout: null});
        }, 300)
    }

    const rotateNext = () => {
        const current = user.schedule.currentIndex; 
        let newIndex = current+1;
        if (newIndex >= user.schedule.rotation.length) {
        newIndex = 0;
        }
        updateUser({schedule: {...user.schedule, currentIndex: newIndex}})
     }


     const calculateExerciseExpenditure = (met=0, setTime=0) => {
        const userWeight = user.tracking.logging["weight"].data[user.tracking.logging["weight"].data.length - 1]?.amount || null;
        //const userHeight = user.settings.height || null;
        //const userAge = user.settings.birthday ? (Date.now() - user.settings.birthday)/1000/60/60/24/365 : null; // In years
        if (userWeight) {
            const userWeightKgs = user.tracking.logging["weight"].unit === "lbs" ? lbsToKgs(userWeight) : userWeight;
            const caloriesPerSecond = (met*3.5*userWeightKgs)/200/60;
            return caloriesPerSecond*setTime;
        }
        return 0;
     }

    const finish = () => {
        const ultimateCloneOfActiveWorkout = JSON.parse(JSON.stringify(workout));
        const currentTime = Date.now();

        let totalWeightLifted = 0;
        let totalDistanceTraveled = 0;
        let totalExpenditure = 0;
        const completedExercises = [];
        const usersCompletedExercises = user.completedExercises;
        workout.exercises.forEach(exercise => {
            const completeSets = exercise.sets.filter(e => e.complete);
            if (completeSets.length < 1) return;
            // Loop complete exercises to 1. get total weight/distance 2. calculate expenditure.
            completeSets.forEach(s => {
                if (s["weight"]) {
                    totalWeightLifted+=parseFloat(s["weight"])*parseInt(s["reps"]);
                    const repTime = 3; // 3 seconds per rep
                    const defaultMET = 3.5;
                    totalExpenditure+=calculateExerciseExpenditure(exercise.met ? exercise.met : defaultMET, repTime*parseInt(s["reps"]) );
                }
                if (s["weightPlus"]) {
                    totalWeightLifted+=parseFloat(s["weightPlus"])*parseInt(s["reps"]);
                    const repTime = 3; // 3 seconds per rep
                    const defaultMET = 3.5;
                    totalExpenditure+=calculateExerciseExpenditure(exercise.met ? exercise.met : defaultMET, repTime*parseInt(s["reps"]) );
                }
                if (s["mile"]) {
                    totalDistanceTraveled+=parseFloat(s["mile"]);
                    const cardioTime = parseInt(s["time"])*60; // Saved in minutes, convert to secs
                    const defaultMET = 3.5;
                    totalExpenditure+=calculateExerciseExpenditure(exercise.met ? exercise.met : defaultMET, cardioTime );
                } 
            });
            const dbExercise = allExercises.find(e => e.id === exercise.id);
            const exerciseData = {
                id: exercise.id,
                name: exercise.name || dbExercise.name,
                date: currentTime,
                sets: completeSets,
                shared: true,
                tracks: exercise.tracks,
                unit: exercise.unit,
            }
            // Push to completed exercises
            completedExercises.push(exerciseData);
            if (usersCompletedExercises[exerciseData.id]) {
                usersCompletedExercises[exerciseData.id].push(exerciseData);
            } else {
                usersCompletedExercises[exerciseData.id] = [exerciseData];
            }

        });
        if (completedExercises.length <= 0) {
            return cancelWorkout(true, "There are no sets marked as complete in this workout.");
        }
        
         // Save each completed exercise
         const workoutLength = currentTime - workout.startTime;
 
         // Finish screen data
         const finishScreenData = {
             workoutName: workout.name, 
             time: currentTime,
             workoutLength,
             totalWeightLifted,
             totalDistanceTraveled,
             exercises: completedExercises,

             fullWorkout: ultimateCloneOfActiveWorkout, // Used to save if user chooses to
         }
        closeSheet();
        showFinishWorkout(finishScreenData);

        if (user.schedule.rotation[user.schedule.currentIndex] === ultimateCloneOfActiveWorkout.id) {
            rotateNext();
        }
        if (!user.pastWorkouts) {
            updateUser({pastWorkouts: []});
        }
        const expenditureData = user.tracking.insights.expenditure.data;
        const lastEntry = expenditureData[expenditureData.length-1];
        let newExpenditureData = JSON.parse(JSON.stringify(expenditureData));
        if (expenditureData.length > 0) {
            const isSameDayAsLastEntry =  new Date(lastEntry.date).toDateString() === new Date(currentTime).toDateString();
            if (isSameDayAsLastEntry) {
                newExpenditureData[newExpenditureData.length-1] = {date: lastEntry.date, amount: lastEntry.amount+totalExpenditure};
            } else {
                newExpenditureData.push({date: currentTime, amount:totalExpenditure});
            }
        } else {
            newExpenditureData.push({date: currentTime, amount: totalExpenditure});
        }
        setTimeout(() => {
            updateUser({
                pastWorkouts: user.pastWorkouts ? [finishScreenData, ...user.pastWorkouts, ] : [finishScreenData],
                completeExercises: usersCompletedExercises,
                activeWorkout: null,
                tracking: {insights: {expenditure: {data: newExpenditureData}}}
            });
        }, 300)
        
    }

  return (
       <View style={{flex: 1}}>
            {/* <PaperProvider> */}
                <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />


                <Animated.View style={[{flexDirection: "row", justifyContent: "flex-end", position: "absolute", left: 0, top: 0, width: "100%", zIndex: 1, elevation: 1}, animatedFinishOpacity]}>
                    <Pressable onPress={true ? requestFinish : null} style={{backgroundColor: "#21863C", paddingVertical: 10, paddingHorizontal: 15, marginRight: 10, borderRadius: 10}}>
                        <Text style={styles.text}>Finish</Text>
                    </Pressable>
                </Animated.View>
                <Animated.View style={[{position: "absolute", width: "100%", alignItems: "center"}, animatedHeaderOpacity]}>
                    <Text style={[styles.text, {fontSize: 18, paddingHorizontal: 10, textAlign: "center"}]}>{truncate(workout.name, 30)}</Text>
                    {startTime !== 0 && <Timer startTime={startTime} textStyle={{fontSize: 15, color: "#C4C4C4"}} />}
                </Animated.View>

                
                {/* <PaperProvider> */}
                    <BottomSheetScrollView style={{marginTop: 85, height: screenHeight-150,}} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 350,}}>
                        
                        <View style={[{ paddingHorizontal: 10}]}>
                            <TextInput selectTextOnFocus onChangeText={updateWorkoutName} onEndEditing={handleEndEditting} value={workout.name} style={styles.workoutNameInput} />
                            {startTime !== 0 && <Timer startTime={startTime} textStyle={{fontSize: 20, color: "#C4C4C4"}} />}
                        </View>

                        <Spacer height={20} />

                        {exercises.map((exercise, i) => (
                            <EditExercise key={exercise.id+""+i} exercise={exercise} updateExercise={updateExercise} removeExercise={() => removeExercise(i)} index={i} activeWorkoutStyle={true} />
                            
                        ))}

                        <Spacer height={20} />
                        <Animated.View layout={LinearTransition.springify().damping(90)}>
                            <BlueButton title={"Add Exercise"} style={{marginRight: 10, marginLeft: 10}} onPress={() => setExerciseModal(true)} />
                            <Spacer height={40} />
                            <BlueButton title={"Cancel Workout"} color={"#572E32"} style={{marginRight: 30, marginLeft: 30}} onPress={() => cancelWorkout(true)} />
                        </Animated.View>
                        
                    </BottomSheetScrollView>
                {/* </PaperProvider> */}
                
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
                ): ( exerciseModal === true ? (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} bottomSheet={true} notModal={true} />
                    </Animated.View>
                ) : null)} */}

                <Portal>
                {( exerciseModal === true && (
                    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={{position: "absolute", top: 0, left: 0, height: screenHeight, width: screenWidth, zIndex: 5, elevation: 5}}>
                        
                             <AddExercise addExercises={addExercises} setExerciseModal={setExerciseModal} bottomSheet={false} notModal={true} />
                        
                       
                    </Animated.View>
                ))}
                </Portal>

            {/* </PaperProvider> */}
            
            
        </View> 
    
  );
}

export default ActiveWorkout

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: 600,
    },
    workoutNameInput: {
        fontSize: 23,
        color: "white",
        flex: 1,
        fontWeight: 700
      }
})