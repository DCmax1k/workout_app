import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from '../ThemedText'
import formatDate from '../../util/formatDate'
import formatDuration from '../../util/formatDuration'
import clock from '../../assets/icons/clock.png'
import weight from '../../assets/icons/weight.png'
import whiteRunner from '../../assets/icons/whiteRunner.png'
import { truncate } from '../../util/truncate'
import { Colors } from '../../constants/Colors'
import rightCarrot from '../../assets/icons/rightCarrot.png'
import { router } from 'expo-router'
import { useUserStore } from '../../stores/useUserStore'


const PastWorkoutCard = ({style, data, reopenExercise = null, onPress = () => {}, disablePress=false, hideDate = false, ...props}) => {

    const openWorkout = () => {
        
        
        onPress();
        router.push({
                    pathname: "/previewWorkout",
                    params: {
                      data: JSON.stringify(data),
                      reopenExercise: JSON.stringify(reopenExercise),
                    },
                  });
    }

    let showDistInstead = false;
    if (!data.totalDistanceTraveled) {
        showDistInstead = false;
    } else if (data.totalWeightLifted === 0 && data.totalDistanceTraveled > 0) {
        showDistInstead = true;
    } else if (data.totalWeightLifted > 0 && data.totalDistanceTraveled === 0) {
        showDistInstead = false;
    } else if (data.totalWeightLifted === 0 && data.totalDistanceTraveled === 0) {
        showDistInstead = false;
    }

  return (
    <View style={{flex: 1}} >

        <View style={[styles.card, style]}>
            {!disablePress && (<Pressable onPress={openWorkout} style={[StyleSheet.absoluteFill, { zIndex: 1}]}></Pressable>)}

            {/* Top side */}
            <View style={[styles.side, styles.top]}>
                <ThemedText title={true} style={{fontSize: 17, fontWeight: "bold"}} >{truncate(data.workoutName, 22)}</ThemedText>
                <ThemedText style={{fontSize: 13, fontWeight: "bold", color: Colors.primaryOrange}}>{data.exercises.length} EXERCISE{data.exercises.length === 1 ? "":"S"}</ThemedText>
            </View>
            {/* Bottom side */}
            <View style={[styles.side, styles.bottom]}>
                <ThemedText style={{fontSize: 13}}>{ !hideDate ? formatDate(data.time) : "Workout"}</ThemedText>

                {/* Quick stats */}
                <View style={styles.quickStats}>

                    <View style={styles.quickStat}>
                        <Image source={clock} style={{height: 15, width: 15, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                        <ThemedText style={{fontSize: 14, fontWeight: 600}}>{formatDuration(data.workoutLength)}</ThemedText>
                    </View>

                    {!showDistInstead && (<View style={[styles.quickStat, {marginLeft: 10}]}>
                        <Image source={weight} style={{height: 20, width: 20, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                        <ThemedText style={{fontSize: 14, fontWeight: 600}}>{parseInt(data.totalWeightLifted)} lbs</ThemedText>
                    </View>)}

                    {showDistInstead && (<View style={[styles.quickStat, {marginLeft: 10}]}>
                        <Image source={whiteRunner} style={{height: 20, width: 20, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                        <ThemedText style={{fontSize: 14, fontWeight: 600}}>{parseInt(data.totalDistanceTraveled)} miles</ThemedText>
                    </View>)}

                </View>
            </View>
            {/* Absolute */}
            <View  style={[styles.absolute]}>
                <Image source={rightCarrot} style={{height: 20, width: 20, objectFit: "contain"}} />
            </View>
        </View>
    </View>
    
  )
}

export default PastWorkoutCard

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderRadius: 10,
        // borderColor: '#ccc',
        // borderWidth: 1,
        backgroundColor: "#272727",
        marginBottom: 10,
        paddingRight: 40,
        display: "relative",
        height: 70,
    },
    side: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    top: {

    },
    bottom: {
        alignItems: "flex-end",
        marginTop: 5,
    },
    absolute: {
        position: "absolute",
        top: 20,
        right: 10,
        height: 30,
        width: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    quickStats: {flexDirection: "row", justifyContent: "center",},
    quickStat: {flexDirection: "row", justifyContent: "center", alignItems: "center",},
})