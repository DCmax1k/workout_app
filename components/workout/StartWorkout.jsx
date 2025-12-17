import { Alert, Dimensions, FlatList, Image, InteractionManager, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../ThemedView'
import ThemedText from '../ThemedText'
import greyX from '../../assets/icons/greyX.png'
import rightArrow from '../../assets/icons/rightArrow.png'
import { Colors } from '../../constants/Colors'
import { Exercises } from '../../constants/Exercises'
import { useUserStore } from '../../stores/useUserStore'
import Exercise from './Exercise'
import { router } from 'expo-router'
import Spacer from '../Spacer'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { runOnJS, runOnUI } from 'react-native-reanimated'
import getAllExercises from '../../util/getAllExercises'

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const StartWorkout = ({workout, setModalVisible, openExercise = (e) => {}, setExerciseOpen = () => {}, openSheetForAndroid = () => {}, ...props}) => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const availableExercises = getAllExercises(user);
    const workoutExercises = workout.exercises.filter(ex => !user.archivedExercises?.[ex.id]);
    const exercises = workoutExercises.map(ex => {
        const foundExercise = availableExercises.find(e => e.id === ex.id);
        if (!foundExercise) return null;
        return availableExercises.find(e => e.id === ex.id);
    }).filter(ex => ex !== null);

    const { openSheet } = useBottomSheet();

    const exercisesToComplex = (clonedWorkoutExercises) => {
        const complexExercises = clonedWorkoutExercises.map(ex => {
            const info = availableExercises.find(e => e.id === ex.id);
            if (!info) return null; // If not found, return the original exercise
            return {
                ...info,
                ...ex,
            }
        }).filter(ex => ex !== null); // Filter out any null values
        return complexExercises;
    }

    const openEditWorkout = () => {
        const clonedWorkout = JSON.parse(JSON.stringify(workout));
        // Make exercises data complex
        const complexExercises = exercisesToComplex(clonedWorkout.exercises);
        clonedWorkout.exercises = complexExercises;
        updateUser({editActiveWorkout: clonedWorkout});
        router.push({
            pathname: "/editworkout",
            params: {
                workout: JSON.stringify(clonedWorkout),
            }
        });
        setModalVisible(false);
    }

    const startWorkout = (bypassCheck = false) => {
        if (bypassCheck === false && user.activeWorkout !== null) {
            // Make sure active workout is visible
            openSheet(0);
            //Alert
            Alert.alert(
                "Workout in progress",
                "If you start a new workout, your current one will be discarded",
                [
                    {text: "Start new workout", style: "destructive", onPress: () => startWorkout(true)},
                    {text: "Do Nothing", style: "cancel"}
                ]
            )
            return;
        } 
        const clonedWorkout = JSON.parse(JSON.stringify(workout));
        // Make exercises data complex
        const complexExercises = exercisesToComplex(clonedWorkout.exercises);
        clonedWorkout.exercises = complexExercises;
        clonedWorkout.startTime = Date.now();

        updateUser({activeWorkout: clonedWorkout});

        openSheet(1);
        openSheetForAndroid();


        setModalVisible(false);

        
        
    }

    const openExerciseFromModal = (exercise) => {
        setModalVisible(false);
        openExercise(exercise);
    }

    const workoutIsSaved = user.savedWorkouts.map(w => w.id).includes(workout.id);

  return (
        <ThemedView style={{ paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 20 : 0, position: 'relative', height: screenHeight, width: screenWidth, elevation: 20}} {...props}>

            <SafeAreaView></SafeAreaView>
            <View style={styles.actionButtons}>
                <View>
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Image style={{height: 50, width: 50}} source={greyX} />
                        {/* <View style={{height: 50, width: 50, justifyContent: "center", alignItems: "center"}}>
                            <Image style={{height: 30, width: 30, tintColor: "grey", transform: [{rotate: "180deg"}]}} source={rightArrow} />
                        </View> */}
                        
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={openEditWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#DB8854", borderRadius: 10, }}>
                        <Text style={{fontSize: 15, color: "white",}}>{workoutIsSaved ? "Edit" : "Copy and Edit"}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.header]}>
                <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>{workout.name}</ThemedText>
                <ThemedText style={{color: "#848484", fontSize: 15}}>{workoutExercises.length} exercise{workoutExercises.length === 1 ? '':'s'}</ThemedText>
            </View>

            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
                {exercises.map((exercise, i) => (
                    <Exercise exercise={exercise} key={exercise.id+""+i} />
                ))}
            </ScrollView> */}

            <Spacer height={10} />

            <FlatList
                data={exercises}
                keyExtractor={(item, i) => item.id+""+i}
                renderItem={({item}) => (<Exercise disablePress={true} onPress={() => openExerciseFromModal(item)} exercise={item} />)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
            />

            <View style={styles.floatingBtnCon}>
                <Pressable style={styles.floatingBtn} onPress={() => startWorkout()}>
                    <Text style={{fontSize: 20, fontWeight: 700, color: "white"}}>Start workout</Text>
                </Pressable>
            </View>
            

        
        
    </ThemedView>
    
  )
}

export default StartWorkout

const styles = StyleSheet.create({
    actionButtons: {
        height: 50,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        alignItems: "center"
    },
    floating: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: screenWidth,
    },
    floatingBtnCon: {

        position: "absolute",
        width: screenWidth,
        bottom: 100,
        left: 0,
        justifyContent: 'center',
        alignItems: "center",
        

       
        
    },
    floatingBtn: {
        paddingVertical: 25,
        paddingHorizontal: 45,
        backgroundColor: Colors.primaryBlue,
        borderRadius: 20,
    }
})