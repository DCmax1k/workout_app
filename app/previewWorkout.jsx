import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import TitleWithBack from '../components/TitleWithBack'
import WorkoutPreview from '../components/workout/WorkoutPreview'
import { router, useLocalSearchParams } from 'expo-router'
import ConfirmMenu from '../components/ConfirmMenu'
import { useUserStore } from '../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import trash from '../assets/icons/trash.png'

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

        // Find workout
        const ind = pastWorkouts.findIndex(w => w.time === data.time);

        // Subtract expenditure data from that day
        const expenditureData = JSON.parse(JSON.stringify(user.tracking.insights["expenditure"].data));
        const idx = expenditureData.length - 1;
        let isSameDay = false; 
        while (!isSameDay) {
            isSameDay = new Date(expenditureData[idx].date).toDateString() === new Date(pastWorkouts[ind].time).toDateString();
            if (isSameDay) {
                const totalExpenditure = pastWorkouts[ind].totalExpenditure || 0;
                console.log("Total expenditure to remove", totalExpenditure);
                console.log("Old expenditure amount", expenditureData[idx].amount);
                expenditureData[idx].amount = Math.max(0, expenditureData[idx].amount - totalExpenditure);
                console.log("New expenditure amount", expenditureData[idx].amount);
                break;
            }
            idx--;
            if (idx < 0) break;
        }
        console.log("Is same day found", isSameDay);
        console.log("Found expenditure data index", idx);
        
        // Slice out to delete
        pastWorkouts.splice(ind, 1);

        // Update user
        console.log("Expenditure data", expenditureData);
        updateUser({pastWorkouts, completedExercises, tracking: {insights: {expenditure: {data: expenditureData}}}});
        router.back();
    }

  return (
    <ThemedView style={{flex: 1}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView zIndex={1} >
            <TitleWithBack backBtn={true} actionBtn={{actionMenu: true, image: require("../assets/icons/threeEllipses.png"), options: [{title: "Delete workout", icon: trash, color: "#FF6C6C", onPress: () => showDeletePastWorkoutConfirmation(data),}],}} />
        </SafeAreaView>
        <WorkoutPreview style={{position: "absolute", width: screenWidth, height: screenHeight, zIndex: 0}} data={data} />
    </ThemedView>
  )
}

export default PreviewWorkoutPage

const styles = StyleSheet.create({})