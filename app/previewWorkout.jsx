import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import TitleWithBack from '../components/TitleWithBack'
import WorkoutPreview from '../components/workout/WorkoutPreview'
import { router, useLocalSearchParams } from 'expo-router'
import ConfirmMenu from '../components/ConfirmMenu'
import { useUserStore } from '../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const PreviewWorkoutPage = () => {
    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const params = useLocalSearchParams();
    const rawdata = JSON.parse(params.data);

    const reopenExercise = JSON.parse(params.reopenExercise);
    if (reopenExercise) {
        // console.log("got to preview page ");
        // console.log(user.activeReopenExercise);
        setTimeout(() => {
            updateUser({activeReopenExercise: reopenExercise})
        }, 500);
        
    }

    const data = rawdata;


    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

    const showDeletePastWorkoutConfirmation = (data) => {
        setConfirmMenuData({
            title: "Delete past workout?",
            subTitle: "All progress data from exercises from this workout session will be erased and you will no longer be able to view this workout.",
            subTitle2: "",
            option1: "Confirm delete",
            option1color: "#DB5454",
            option2: "Go back",
            confirm: () => deletePastWorkout(data),
        });
        setConfirmMenuActive(true);
    }

    const deletePastWorkout = (data) => {
        const pastWorkouts = user.pastWorkouts;

        // Go through each exercise and delete the completed exercise info with the same data as workout
        const completedExercises = {...user.completedExercises};
        data.exercises.forEach(exer => {
            const exTime = exer.date;
            let completedIndex = completedExercises[exer.id].findIndex(ex => ex.date === exTime); 
            do {
               completedExercises[exer.id].splice(completedIndex, 1);
               completedIndex = completedExercises[exer.id].findIndex(ex => ex.date === exTime); 
            } while (completedIndex > -1)
        });

        // Find workout and slice out to delete
        const ind = pastWorkouts.findIndex(w => w.time === data.time);
        pastWorkouts.splice(ind, 1);

        // Update user
        updateUser({pastWorkouts, completedExercises});
        router.back();
    }

  return (
    <ThemedView style={{flex: 1}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView zIndex={1} >
            <TitleWithBack backBtn={true} actionBtn={{actionMenu: true, image: require("../assets/icons/threeEllipses.png"), action: () => showDeletePastWorkoutConfirmation(data)}} />
        </SafeAreaView>
        <WorkoutPreview style={{position: "absolute", width: screenWidth, height: screenHeight, zIndex: 0}} data={data} />
    </ThemedView>
  )
}

export default PreviewWorkoutPage

const styles = StyleSheet.create({})