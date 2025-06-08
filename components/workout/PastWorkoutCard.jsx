import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from '../ThemedText'
import formatDate from '../../util/formatDate'
import formatDuration from '../../util/formatDuration'
import clock from '../../assets/icons/clock.png'
import weight from '../../assets/icons/weight.png'
import { truncate } from '../../util/truncate'
import { Colors } from '../../constants/Colors'
import rightCarrot from '../../assets/icons/rightCarrot.png'


const PastWorkoutCard = ({style, data, setConfirmMenuData, setConfirmMenuActive, ...props}) => {

    const showComingSoon = () => {
        setConfirmMenuData({
            title: "Coming soon!",
            option1: "Close",
            confirm: () => {},
        });
        setConfirmMenuActive(true);
    }

  return (
    <Pressable style={{flex: 1}} onPress={showComingSoon}>
        <View style={[style, styles.card]}>
            {/* Top side */}
        <View style={[styles.side, styles.top]}>
            <ThemedText title={true} style={{fontSize: 17, fontWeight: "bold"}} >{truncate(data.workoutName, 22)}</ThemedText>
            <ThemedText style={{fontSize: 13, fontWeight: "bold", color: Colors.primaryOrange}}>{data.exercises.length} EXERCISES</ThemedText>
        </View>
        {/* Bottom side */}
        <View style={[styles.side, styles.bottom]}>
            <ThemedText style={{fontSize: 13}}>{formatDate(data.time)}</ThemedText>
            {/* Quick stats */}
            <View style={styles.quickStats}>
                <View style={styles.quickStat}>
                    <Image source={clock} style={{height: 15, width: 15, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                    <ThemedText style={{fontSize: 14, fontWeight: 600}}>{formatDuration(data.workoutLength)}</ThemedText>
                </View>
                <View style={[styles.quickStat, {marginLeft: 10}]}>
                    <Image source={weight} style={{height: 20, width: 20, objectFit: "contain", tintColor: "white", marginRight: 5}} />
                    <ThemedText style={{fontSize: 14, fontWeight: 600}}>{parseInt(data.totalWeightLifted)} lbs</ThemedText>
                </View>
            </View>
        </View>
        {/* Absolute */}
        <View  style={[styles.absolute]}>
            <Image source={rightCarrot} style={{height: 20, width: 20, objectFit: "contain"}} />
        </View>
        </View>
    </Pressable>
    
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