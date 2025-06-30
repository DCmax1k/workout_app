import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../components/ThemedView'
import TitleWithBack from '../components/TitleWithBack'
import WorkoutPreview from '../components/workout/WorkoutPreview'
import { router, useLocalSearchParams } from 'expo-router'
import ConfirmMenu from '../components/ConfirmMenu'
import { useUserStore } from '../stores/useUserStore'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const PreviewWorkoutPage = () => {

    const { data } = useLocalSearchParams()
        const newData = JSON.parse(data);

        const user = useUserStore(state => state.user);
        const updateUser = useUserStore(state => state.updateUser);

        const [confirmMenuActive, setConfirmMenuActive] = useState(false);
            const [confirmMenuData, setConfirmMenuData] = useState();

    
    const showDeletePastWorkoutConfirmation = (data) => {
        setConfirmMenuData({
            title: "Delete past workout?",
            subTitle: "You will no longer be able to view this workout.",
            subTitle2: "",
            option1: "Delete past workout",
            option1color: "#DB5454",
            option2: "Go back",
            confirm: () => deletePastWorkout(data),
        });
        setConfirmMenuActive(true);
    }

    const deletePastWorkout = (data) => {
        const pastWorkouts = user.pastWorkouts;
        const ind = pastWorkouts.findIndex(w => w.time === data.time);
        pastWorkouts.splice(ind, 1);
        updateUser(pastWorkouts);
        router.back();
    }

  return (
    <ThemedView style={{flex: 1}}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView zIndex={1} >
            <TitleWithBack backBtn={true} actionBtn={{actionMenu: true, image: require("../assets/icons/threeEllipses.png"), action: () => showDeletePastWorkoutConfirmation(newData)}} />
        </SafeAreaView>
        <WorkoutPreview style={{position: "absolute", width: screenWidth, height: screenHeight, zIndex: 0}} data={newData} />
    </ThemedView>
  )
}

export default PreviewWorkoutPage

const styles = StyleSheet.create({})