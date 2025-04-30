import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import Spacer from '../../../components/Spacer'
import { useUserStore } from '../../../stores/useUserStore'
const rightArrow = require('../../../assets/icons/rightArrow.png')
const hamburger = require('../../../assets/icons/hamburger.png')
const remove = require('../../../assets/icons/remove.png')

const Schedule = () => {
    const user = useUserStore((state) => state.user);

    const rotation = user.savedWorkouts.filter(workout => user.schedule.rotation.includes(workout.id));
    const unused = user.savedWorkouts.filter(workout => !user.schedule.rotation.includes(workout.id));

  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
                <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20, textAlign: 'center'}}>Schedule Rotation</ThemedText>
                <Spacer />

                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Schedule</ThemedText>
                {rotation.map((workout, index) => {
                    return (
                        <Pressable key={workout.id} style={[styles.listItem]} onPress={() => {Alert.alert("Move back")}}>
                            <Image style={[styles.listItemIcon, styles.rotationItemIcon]} source={remove} />
                            <ThemedText style={{fontSize: 15, fontWeight: 700,}} title={true} >{workout.name}</ThemedText>
                        </Pressable>
                    )
                })}
                <Pressable style={[styles.addRestDay]} onPress={() => {Alert.alert("Rest Day")}}>
                    <ThemedText color={"#636363"} style={{fontSize: 16, fontWeight: 700, textAlign: "center"}}>Add Rest Day</ThemedText>
                    <ThemedText color={"#636363"} style={{fontSize: 13, fontWeight: 400, textAlign: "center"}}>or select a workout from below</ThemedText>
                </Pressable>

                <Spacer />
                <ThemedText style={{fontSize: 15, fontWeight: 700, marginBottom: 10}}>Unused</ThemedText>
                {unused.map((workout, index) => {
                    return (
                        <Pressable key={workout.id} style={styles.listItem} onPress={() => {Alert.alert("Adding")}}>
                            <Image style={styles.listItemIcon} source={rightArrow} />
                            <ThemedText style={{fontSize: 15, fontWeight: 700,}} title={true} >{workout.name}</ThemedText>
                        </Pressable>
                    )
                })}

            </ScrollView>
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