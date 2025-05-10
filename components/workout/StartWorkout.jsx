import { Alert, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../ThemedView'
import ThemedText from '../ThemedText'
import greyX from '../../assets/icons/greyX.png'
import { Colors } from '../../constants/Colors'
import { Exercises } from '../../constants/Exercises'
import { useUserStore } from '../../stores/useUserStore'
import Exercise from './Exercise'
import { router } from 'expo-router'
import Spacer from '../Spacer'
import { useBottomSheet } from '../../context/BottomSheetContext'

const screenWidth = Dimensions.get('window').width;

const StartWorkout = ({workout, setModalVisible, ...props}) => {
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const availableExercises = [...user.createdExercises, ...Exercises.filter(ex => !user.createdExercises.map(e => e.id).includes(ex.id))];
    const exercises = workout.exercises.map(ex => {
        return availableExercises.find(e => e.id === ex.id);
    });

    const { openSheet } = useBottomSheet();

    const exercisesToComplex = (exercises) => {
        const complexExercises = exercises.map(ex => {
        const usersInfo = user.createdExercises.find(e => {
            return e.id === ex.id
        });
        if (usersInfo) {
            return {
            ...usersInfo,
            ...ex,
            }
        }
        const info = Exercises.find(e => e.id === ex.id);
        return {
            ...info,
            ...ex,
        }
        });
        return complexExercises;
    }

    const openEditWorkout = () => {
        const clonedWorkout = JSON.parse(JSON.stringify(workout));
        // Make exercises data complex
        const complexExercises = exercisesToComplex(clonedWorkout.exercises);
        clonedWorkout.exercises = complexExercises;
        updateUser({editActiveWorkout: clonedWorkout});
        router.push("/editworkout");
        setModalVisible(false);
    }

    const startWorkout = (bypassCheck = false) => {
        if (bypassCheck === false && user.activeWorkout !== null) {
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

        setModalVisible(false);
        openSheet(1);
    }
  return (
    <ThemedView style={{flex: 1, padding: 20}}>
        <View style={styles.actionButtons}>
            <View>
                <Pressable onPress={() => setModalVisible(false)}>
                    <Image style={{height: 50, width: 50}} source={greyX} />
                </Pressable>
            </View>
            <View>
                <Pressable onPress={openEditWorkout} style={{paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#DB8854", borderRadius: 10, }}>
                    <Text style={{fontSize: 15, color: "white",}}>Edit</Text>
                </Pressable>
            </View>
        </View>

        <View style={[styles.header]}>
            <ThemedText title={true} style={{fontSize: 23, fontWeight: 700, textAlign: "center"}}>{workout.name}</ThemedText>
            <ThemedText style={{color: "#848484", fontSize: 15}}>{workout.exercises.length} exercise{workout.exercises.length === 1 ? '':'s'}</ThemedText>
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
            renderItem={({item}) => (<Exercise exercise={item} />)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
        />

        <Pressable style={styles.floatingBtn} onPress={() => startWorkout()}>
            <Text style={{fontSize: 20, fontWeight: 700, color: "white"}}>Start workout</Text>
        </Pressable>
        
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
    floatingBtn: {
        position: "absolute",
        bottom: 50,
        left: screenWidth/2,
        transform: [{translateX: "-50%"}],
        paddingVertical: 25,
        paddingHorizontal: 45,
        backgroundColor: Colors.primaryBlue,
        borderRadius: 20,
    }
})