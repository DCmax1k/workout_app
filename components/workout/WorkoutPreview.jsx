import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from '../ThemedText'
import Spacer from '../Spacer'
import { Colors } from '../../constants/Colors';
import formatDuration from '../../util/formatDuration';
import clock from '../../assets/icons/clock.png';
import weight from '../../assets/icons/weight.png';
import whiteRunner from '../../assets/icons/whiteRunner.png';
import formatDate from '../../util/formatDate';

const screenHeight = Dimensions.get("window").height;

const WorkoutPreview = ({style, data, ...props}) => {

  const workout = data.fullWorkout;

  return (
    <View style={[style, styles.cont]} >

      {/* Behind section */}
      <View style={[styles.section, {alignItems: "center", zIndex: 0}]} >
        <Spacer height={125} />
        <ThemedText title={true} style={{fontSize: 25, fontWeight: "bold"}} >{data.workoutName}</ThemedText>
        <ThemedText title={false} style={{fontSize: 15}} >{formatDate(data.time)}</ThemedText>

        <Spacer />

        <View style={{flexDirection: "row", }}>

          <View style={{marginHorizontal: 5, alignItems: "center", minWidth: 100}}>
            <View style={{height: 30, width: 30, overflow: "visible", justifyContent: "center", alignItems: "center", marginBottom: 5}}>
              <Image style={{height: 30, width: 30, objectFit: "contain"}} source={clock} />
            </View>
            <ThemedText style={{color: "white", fontSize: 17}}>{formatDuration(data.workoutLength)}</ThemedText>
          </View>

          {data.totalWeightLifted > 0 && (<View style={{marginHorizontal: 5, alignItems: "center", minWidth: 100}}>
            <View style={{height: 30, width: 30, overflow: "visible", justifyContent: "center", alignItems: "center", marginBottom: 5}}>
              <Image style={{height: 40, width: 40, objectFit: "contain"}} source={weight} />
            </View>
            <ThemedText style={{color: "white", fontSize: 17}}>{`${parseInt(data.totalWeightLifted)} lbs`}</ThemedText>
          </View>)}

          {data.totalDistanceTraveled > 0 && (<View style={{marginHorizontal: 5, alignItems: "center", minWidth: 100}}>
            <View style={{height: 30, width: 30, overflow: "visible", justifyContent: "center", alignItems: "center", marginBottom: 5}}>
              <Image style={{height: 40, width: 40, objectFit: "contain"}} source={whiteRunner} />
            </View>
            <ThemedText style={{color: "white", fontSize: 17}}>{`${parseInt(data.totalDistanceTraveled)} miles`}</ThemedText>
          </View>)}

        </View>
      </View>

      {/* Scroll Section */}
      <View style={[styles.section, {zIndex: 1}]}>
        <ScrollView style={{flex: 1, marginBottom: -screenHeight}} contentContainerStyle={{paddingTop: 300}} showsVerticalScrollIndicator={false}>
          <View style={{minHeight: screenHeight, paddingBottom: 50, backgroundColor: Colors.primaryBlue, borderTopLeftRadius: 40, borderTopRightRadius: 40, position: "relative", alignItems: "center"}}>
            <View style={{backgroundColor: "white", width: 100, height: 4, borderRadius: 9999, marginTop: 10}}></View>
            <Spacer height={10} />

            <Text style={{fontSize: 20, fontWeight: 600, color: "white"}}>{data.exercises.length} exercise{data.exercises.length===1 ? "":"s"}</Text>
            <Spacer height={20} />

            {data.exercises.map((ex, i) => {
              const showWeight = (ex.tracks.includes("weight") || ex.tracks.includes("weightPlus"));
              const showReps = (ex.tracks.includes("reps"));
              const showDistance = (ex.tracks.includes("mile"));
              const showTime = (ex.tracks.includes("time"));
              return (
                <View key={i} style={{width: "100%", paddingHorizontal: 10}}>
                  <Text style={{color: "white", fontSize: 16, fontWeight: 500}}>{ex.sets.length} x {ex.name}</Text>
                  {ex.sets.map((set, j) => {
                    return (
                      <View key={j} style={{height: 80, width: "100%", backgroundColor: "rgba(0,0,0,0.25)", marginTop: 10, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20}}>
                        <View>
                          <Text style={{color: "white", fontSize: 15, fontWeight: 600}}>Set {j+1}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                          <Text style={{fontSize: 15, color: "white", fontWeight: 600}} >{showWeight ? `${set["weight"]} lb` : null }{showDistance ? `${set["mile"]} miles` : null }</Text>
                          <Text style={{fontSize: 15, color: "#A2B4FF", fontWeight: 600}}>{showReps ? ` x ${set["reps"]}` : null }{showTime ? ` in ${set["time"]}` : null }</Text>
                        </View>
                      </View>
                    )
                  })}
                  <Spacer />
                </View>
              )
            })}
              <Spacer height={100} />
             <Spacer height={screenHeight} />

          </View>
        </ScrollView>
      </View>

    </View>
  )
}

export default WorkoutPreview

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  section: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
})