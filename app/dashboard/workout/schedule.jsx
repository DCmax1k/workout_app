import { Alert, FlatList, Image, LayoutAnimation, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
import TitleWithBack from '../../../components/TitleWithBack'
import { router } from 'expo-router'
import Animated, { FadeIn, FadeOut, Layout, LinearTransition, StretchInY, StretchOutY } from 'react-native-reanimated'
const { getState } = useUserStore
const rightArrow = require('../../../assets/icons/rightArrow.png')
const hamburger = require('../../../assets/icons/hamburger.png')
const remove = require('../../../assets/icons/remove.png')

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

  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
            <TitleWithBack title={"Schedule"} style={{marginLeft: -20}} />
            <Spacer height={20} />
            <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100,}}>
                
                <Spacer height={20} />

                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Schedule Rotation</ThemedText>
                {rotation.map((workout, index) => {
                    const isRestDay = workout.id === "0";
                    return (
                        <Animated.View key={`${workout.id}+${index}`} layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
                            <Pressable  style={[styles.listItem, isRestDay ? styles.restDay : null]} onPress={() => removeFromRotation(workout.id, index)}>
                                <Image style={[styles.listItemIcon, styles.rotationItemIcon]} source={remove} />
                                <ThemedText style={{fontSize: 15, fontWeight: 700,}} title={true} >{truncate(workout.name, 30)}</ThemedText>
                            </Pressable>
                        </Animated.View>
                        
                    )
                })}
                <Animated.View layout={LinearTransition}>
                    <Pressable style={[styles.addRestDay]} onPress={addRestDay}>
                        <ThemedText color={"#636363"} style={{fontSize: 16, fontWeight: 700, textAlign: "center"}}>Add Rest Day</ThemedText>
                        <ThemedText color={"#636363"} style={{fontSize: 13, fontWeight: 400, textAlign: "center"}}>or select a workout from below</ThemedText>
                    </Pressable>
                </Animated.View>

                <Spacer />

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

            </Animated.ScrollView>
        </SafeAreaView>
    </ThemedView>
  )
}

export default Schedule

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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