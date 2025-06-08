import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThemedView from '../ThemedView'
import ThemedText from '../ThemedText'
import greyX from '../../assets/icons/greyX.png'
import plus from '../../assets/icons/plus.png'
import { Colors } from '../../constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'
import party from '../../assets/icons/party.png'
import Spacer from '../Spacer'
import clock from '../../assets/icons/clock.png'
import weight from '../../assets/icons/weight.png'
import { useAudioPlayer } from 'expo-audio'
import { useUserStore } from '../../stores/useUserStore'
import ConfirmMenu from '../ConfirmMenu'
import { PaperProvider } from 'react-native-paper'
import { deepEqual } from '../../util/deepEqual'
import { workoutToSimple } from '../../util/workoutToSimple'
import formatDate from '../../util/formatDate'
import formatDuration from '../../util/formatDuration'

const audioSource = require("../../assets/sounds/success.wav");

const FinishWorkout = ({data, closeModal, ...props}) => {
    const successPlayer = useAudioPlayer(audioSource);

    const user = useUserStore(state => state.user);
    const updateUser = useUserStore(state => state.updateUser);

    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState({
        title: "The title",
        subTitle: "The description for the confirmation",
        subTitle2: "Another one here",
        option1: "Update",
        option2: "Cancel",
        confirm: () => {},
    });

    useEffect(() => {
        successPlayer.play();
        
        setTimeout(() => {

            // Party png
            partyScale.value = withSpring(1.5);
            setTimeout(() => {
                partyScale.value = withSpring(1);

                // Title opacity
                titleOpacity.value = withTiming(1, {duration: 1000})
                // Subtitle opacity
                setTimeout(() => {
                    subTitleOpacity.value = withTiming(1, {duration: 1000})
                    setTimeout(() => {
                        workoutOpacity.value = withTiming(1, {duration: 1000})

                        setTimeout(checkForWorkoutUpdate, 500);
                    }, 300);
                }, 300);
            }, 300);

        }, 100);
    }, [])

    const saveWorkout = (w) => {
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
        updateUser({savedWorkouts});
    }

    const checkForWorkoutUpdate = () => {
        const workout = data.fullWorkout;
        if (workout.exercises.length < 1) return;
        // After 1000 ms, ask if workout should be created or updated
        const w = workoutToSimple(workout)
        const savedWorkouts = user.savedWorkouts;
        const findIndex = savedWorkouts.findIndex(wk => wk.id === w.id);
        if (findIndex < 0) {
            // Ask to create workout
            setConfirmMenuData({
                title: "Create workout",
                subTitle: "You've created a new workout.",
                subTitle2: "Would you like to save it?",
                option1: "Save workout",
                option2: "Don't save",
                confirm: () => saveWorkout(w),
            });
            setConfirmMenuActive(true);
        } else {
            // Check if values differ from saved
            const isSame = deepEqual(w, savedWorkouts[findIndex]);
            if (!isSame) {
                // Ask to update workout
                setConfirmMenuData({
                    title: "Update workout",
                    subTitle: "You've made changes to your workout.",
                    subTitle2: "Would you like to update it?",
                    option1: "Update values",
                    option2: "Don't change",
                    confirm: () => saveWorkout(w),
                });
                setConfirmMenuActive(true);
            }
        }
    }

      // Animations
      const partyScale = useSharedValue(0.5);
      const partyAnimationStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: partyScale.value}]
        }
      }, [])

      const titleOpacity = useSharedValue(0);
      const titleAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity: titleOpacity.value,
        }
      }, [])
      const subTitleOpacity = useSharedValue(0);
      const subTitleAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity: subTitleOpacity.value,
        }
      }, [])
      const workoutOpacity = useSharedValue(0);
      const workoutAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity: workoutOpacity.value,
        }
      }, [])

  return (
    <PaperProvider>
        <ThemedView style={{flex: 1}} {...props}>
            <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.actionButtons}>
                    <View>
                        <Pressable onPress={closeModal}>
                            <Image style={{height: 50, width: 50}} source={greyX} />
                        </Pressable>
                    </View>
                    <View style={{zIndex: 1}}>
                        <Pressable onPress={() => {}} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.primaryBlue, borderRadius: 10, }}>
                            <Text style={{fontSize: 15, color: "white",}}>Share</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={[{ alignItems: "center"}]}>
                    <Animated.View style={partyAnimationStyle}>
                        <Image source={party} style={{height: 150,  width: 150, objectFit: "contain"}} />
                    </Animated.View>

                    <Animated.Text title={true} style={[{ fontSize: 25, fontWeight: 700, color: "white"}, titleAnimationStyle]}>Well done!</Animated.Text>
                    <Animated.Text style={[{ fontSize: 15, fontWeight: 400, color: "#848086"}, subTitleAnimationStyle]}>You completed your workout!</Animated.Text>

                    <Spacer />

                    <View style={{width: "100%", paddingHorizontal: 20}}>
                        <Animated.View style={[styles.workoutBubble, workoutAnimationStyle]}>
                            <ThemedText title={true} style={{ fontSize: 18, fontWeight: 700, textAlign: "center"}}>{data.workoutName}</ThemedText>
                            <ThemedText style={{ fontSize: 14, fontWeight: 400, textAlign: "center"}}>{formatDate(data.time)}</ThemedText>
                            <View style={styles.quickStats}>
                                <View style={styles.quickStat}>
                                    <Image source={clock} style={{height: 15, width: 15, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                                    <ThemedText style={{fontSize: 14, fontWeight: 600}}>{formatDuration(data.workoutLength)}</ThemedText>
                                </View>
                                <View style={styles.quickStat}>
                                    <Image source={weight} style={{height: 20, width: 20, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                                    <ThemedText style={{fontSize: 14, fontWeight: 600}}>{data.totalWeightLifted} lbs</ThemedText>
                                </View>
                            </View>
                            <View style={[styles.moreDepth]}>
                                <View style={styles.column}>
                                    <ThemedText title={true} style={{fontSize: 14, fontWeight: 600}}>Exercise</ThemedText>
                                    <>
                                    {data.exercises.map((exercise, i) => {
                                        return (<ThemedText key={i}>{exercise.sets.length} x {exercise.name}</ThemedText>);
                                    })}
                                    </>
                                </View>
                                <View style={styles.column}>
                                    <ThemedText title={true} style={{fontSize: 14, fontWeight: 600}}>Best set</ThemedText>
                                    <>
                                    {data.exercises.map((exercise, ind) => {
                                        let highestAmount = 0;
                                        let highestAmountIndex = 0;
                                        exercise.sets.forEach((s, i) => {
                                            const group = exercise.tracks.includes("weight") ? "strength" : exercise.tracks.includes("weightPlus") ? "strengthPlus" : (exercise.tracks.includes("mile") && exercise.tracks.includes("time")) ? "cardio" : exercise.tracks.includes("mile") ? "distance" : exercise.tracks.includes("reps") ? "repsOnly" : null;
                                            const track = group === "strength" ? "weight" : group==="strengthPlus" ? "weightPlus" : group==="cardio" ? "mile" : group==="distance" ? "mile" : group==="repsOnly" ? "reps" : null;
                                            const value = track ? parseFloat(s[track]) : 0;
                                            if (value > highestAmount) {
                                                highestAmountIndex = i;
                                                highestAmount = value;
                                            }
                                        });
                                        const bestSet = exercise.sets[highestAmountIndex];
                                        let returnValue = "";
                                        if (exercise.tracks.includes("mile")) returnValue = `${highestAmount} miles`;
                                        else if (exercise.tracks.includes("weight") || exercise.tracks.includes("weightPlus")) returnValue = `${highestAmount} lbs`;
                                        if (exercise.tracks.includes("reps")) returnValue += ` x${bestSet["reps"]}`;
                                        return (
                                            <ThemedText key={ind}>{returnValue}</ThemedText>
                                        )
                                        
                                    })}
                                    </>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </View>
                
                
            </SafeAreaView>
        
        </ThemedView>  
    </PaperProvider>
    
  )
}

export default FinishWorkout

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        margin: 10,
    },
    workoutBubble: {width: "100%", backgroundColor: "#2F3758", borderRadius: 20, alignItems: "center", padding: 30,},
    quickStats: {flexDirection: "row", justifyContent: "center", marginTop: 10},
    quickStat: {flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: 10},

    moreDepth: {flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "100%"},
    column: {flexDirection: "column", alignItems: "flex-start"},
})