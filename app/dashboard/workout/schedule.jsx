import { Alert, FlatList, Image, LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import TitleWithBack from '../../../components/TitleWithBack'
import { router } from 'expo-router'
import Animated, { FadeIn, FadeOut, Layout, LinearTransition, StretchInY, StretchOutY } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import BlueButton from '../../../components/BlueButton'
import { generateUniqueId } from '../../../util/uniqueId'
const { getState } = useUserStore
const rightArrow = require('../../../assets/icons/rightArrow.png')
const hamburger = require('../../../assets/icons/hamburger.png')
const plus = require('../../../assets/icons/plus.png')
const remove = require('../../../assets/icons/remove.png')
const scheduleRotationArrow = require('../../../assets/icons/scheduleRotationArrow.png')
const scheduleRotationArrowLength = require('../../../assets/icons/scheduleRotationArrowLength.png')

const Schedule = () => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);

    const rotation = user.schedule.rotation.map(id => {
        if (id === "0") {
            return {id: "0", name: "Rest Day"}
        }

        return user.savedWorkouts.find(w => w.id === id)
    })
    const unused = user.savedWorkouts.filter(workout => !user.schedule.rotation.includes(workout.id));

    const addToRotation = (workoutId) => {
        // Add workout to rotation
        const newRotation = [...user.schedule.rotation, workoutId];
        updateUser({schedule: {...user.schedule, rotation: newRotation}});
    }

    const removeFromRotation = (workoutId, restDayIndex = 0) => {
        let schedule = user.schedule;
        if (workoutId === "0") {
            // Remove rest day from rotation
            const newRotation = user.schedule.rotation.filter((id, index) => index !== restDayIndex);
            schedule = {...schedule, rotation: newRotation};
        } else {
            // Remove workout from rotation
            const newRotation = user.schedule.rotation.filter(id => id !== workoutId);
            schedule = {...schedule, rotation: newRotation}
        }
    
        schedule = {...schedule, currentIndex: 0}

        updateUser({schedule});
    }

    const addRestDay = () => {
        // Add rest day to rotation
        const newRotation = [...user.schedule.rotation, "0"];
        updateUser({schedule: {...user.schedule, rotation: newRotation}});
    }

    const truncate = (text, maxLength) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    const createNewWorkout = () => {
        const newWorkoutData = {name: "New workout", id: generateUniqueId(), exercises: [] };
        updateUser({editActiveWorkout: newWorkoutData});
        router.push("/editworkout");
    }

  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
            <TitleWithBack title={"Schedule"} style={{marginLeft: -20}} />
            <Spacer height={20} />
            <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100,}}>
                
                <Spacer height={20} />

                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Rotation</ThemedText>
                {rotation.map((workout, index) => {
                    const isRestDay = workout.id === "0";
                    return (
                        <Animated.View style={{flex: 1, position: "relative", }} key={`${workout.id}+${index}`} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                            <Pressable  style={[styles.listItem, isRestDay ? styles.restDay : null, {marginRight: 30}]} onPress={() => removeFromRotation(workout.id, index)}>
                                <Image style={[styles.listItemIcon, styles.rotationItemIcon]} source={remove} />
                                <ThemedText style={{fontSize: 15, fontWeight: 700,}} title={true} >{truncate(workout.name, 30)}</ThemedText>
                            </Pressable>
                            <View style={{position: "absolute", right: 0, top: 0, height: "120%",}}>
                                <Image source={scheduleRotationArrowLength} style={{height: "100%", width: 20, objectFit: "fill"}} />
                            </View>
                        </Animated.View>
                        
                    )
                })}
                <Animated.View layout={LinearTransition} style={{flex: 1, position: "relative", }}>
                    <Pressable style={[styles.addRestDay, {marginRight: 30, marginBottom: 10}]} onPress={addRestDay}>
                        <ThemedText color={"#636363"} style={{fontSize: 16, fontWeight: 700, textAlign: "center"}}>Add Rest Day</ThemedText>
                        <ThemedText color={"#636363"} style={{fontSize: 13, fontWeight: 400, textAlign: "center"}}>or select a workout from below</ThemedText>
                    </Pressable>
                    <View style={{position: "absolute", right: 0, top: 0, height: "100%",}}>
                        <Image source={scheduleRotationArrow} style={{height: "100%", width: 20, objectFit: "fill"}} />
                    </View>
                </Animated.View>

                <Spacer height={25} />

                <Animated.View  layout={LinearTransition}>
                   <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Unused</ThemedText> 
                </Animated.View>
                

                {unused.map((workout, index) => {
                    return (
                        <Animated.View key={`${workout.id}+${index}`} entering={FadeIn} exiting={FadeOut} layout={LinearTransition} >
                            <Pressable style={styles.listItem} onPress={() => addToRotation(workout.id)}>
                                <Image style={styles.listItemIcon} source={rightArrow} />
                                <ThemedText style={{fontSize: 15, fontWeight: 700,}} title={true} >{truncate(workout.name, 30)}</ThemedText>
                            </Pressable>
                        </Animated.View>
                        
                    )
                })}
                {user.savedWorkouts.length < 1 === true && (
                    <View style={{flex: 1}}>
                        <ThemedText style={{flex: 1, textAlign: "center", paddingVertical: 10}}>No created workouts.</ThemedText>
                        <BlueButton title={"Create a new workout"} icon={plus} onPress={createNewWorkout} />
                    </View>
                    
                )}

            </Animated.ScrollView>
        </SafeAreaView>
    </ThemedView>
  )
}

export default Schedule

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },  
    listItem: {
        padding: 10,
        paddingVertical: 18,
        borderRadius: 10,
        backgroundColor: "#3A3A3A",
        marginBottom: 10,
        flexDirection: "row",
    },
    restDay: {
        backgroundColor: "#4B3B30",
    },  
    listItemIcon: {
        width: 15,
        height: 15,
        marginRight: 10,
        alignSelf: "center",
        transform: [{rotate: "-90deg"}],
    },
    rotationItemIcon: {
        transform: [{rotate: "0deg"}],
    },
    removePressable: {
        height: "100%",
        width: 30,
        marginLeft: "auto",
    },
    removeIcon: {
        width: 20,
        height: 20,
        marginHorizontal: "auto",
    },
    addRestDay: {
        borderColor: "#3A3A3A",
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: "dashed",
        padding: 10,
    }
  })