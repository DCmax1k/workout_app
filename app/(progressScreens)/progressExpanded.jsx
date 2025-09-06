import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'

import { router, useLocalSearchParams } from 'expo-router'
import TitleWithBack from '../../components/TitleWithBack'
import GraphWidget from '../../components/GraphWidget'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pressable, ScrollView } from 'react-native-gesture-handler'
import Spacer from '../../components/Spacer'
import pencilIcon from '../../assets/icons/pencil.png'
import noEye from '../../assets/icons/noEye.png'
import rotate from '../../assets/icons/rotate.png'

import { EventEmitter } from "expo-modules-core";
import { useEffect, useState } from 'react'
import { useUserStore } from '../../stores/useUserStore'
import ConfirmMenu from '../../components/ConfirmMenu'

export const emitter = new EventEmitter();


const screenWidth = Dimensions.get('screen').width;

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const ProgressExpanded = () => {

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const params = useLocalSearchParams();
  const w = JSON.parse(params.data);
  const wi = user.tracking.logging[w.category] || user.tracking.insights[w.category] || w;
  const widget = {
    category: w.category,
    ...wi,
  }
  // console.log("NEW WIDGET", widget);

  

  useEffect(() => {
    const sub = emitter.addListener("done", (data) => {
      //console.log("Got data back:", data);
      if (data.widget.layout === "weight") { // Push new data point with new date
        if (data.target === "value") {
          const nData = user.tracking.logging[data.widget.category].data;
          const cData = [...nData, {date: Date.now(), amount: data.value}];
          const updated = {tracking: {logging: {[data.widget.category]: {data: cData}}}};
          updateUser(updated);
          //console.log("updated ", updated);
        } else if (data.target === 'goal') {
          const updated = {tracking: {logging: {[data.widget.category]: {extraData: {goal: data.value}}}}};
          updateUser(updated);
        } else {
          console.log("Tried changing value with emit but value not found");
        }
        

      } else if (data.widget.layout === "calorie") { // Edit last data point if the last point is 

      }
    });
    return () => sub.remove();
  }, [emitter, updateUser, user.tracking.logging[w.category]]);

  const mostRecentValue = widget.data[widget.data.length - 1]?.amount || 0;
  const mostRecentDate = widget.data[widget.data.length - 1]?.date || null;

  const showYear = new Date(mostRecentDate).getFullYear() !== new Date().getFullYear();
  let showYearOptions = {};
  if (showYear) {
    showYearOptions.year = "numeric";
  }

  //console.log(widget);

  let bmiSectionIndex = -1 ;
  if (widget.layout === 'bmi') {
    if ( mostRecentValue < 18.5 ) {
      bmiSectionIndex = 0;
    } else if (mostRecentValue >= 18.5 && mostRecentValue < 25) {
      bmiSectionIndex = 1;
    } else if (mostRecentValue >= 25 && mostRecentValue < 30) {
      bmiSectionIndex = 2;
    } else if (mostRecentValue >= 30) {
      bmiSectionIndex = 3;
    }
  }
  
  const clickGoal = () => {
    const info = {
      title: firstCapital(widget.category) + " goal",
      target: "goal",
      value: widget.extraData.goal || widget.inputOptions.defaultValue,
      unit:  widget.unit,
      widget,
      ...widget.inputOptions
    }
    router.push({
      pathname: "/inputValueScreen",
      params: {
        data: JSON.stringify(info),
      },
    });
  }

  const clickValue = () => {
    const info = {
      title: widget.category,
      target: 'value',
      value: mostRecentValue || 0,
      unit: widget.unit,
      widget,
      ...widget.inputOptions
    }
    router.push({
      pathname: "/inputValueScreen",
      params: {
        data: JSON.stringify(info),
      },
    });
  }

  const openEditPastData = () => {
    const info = {
      title: widget.category,
      target: 'value',
      value: mostRecentValue || 0,
      unit: widget.unit,
      widget,
      ...widget.inputOptions
    }
    router.push({
      pathname: "/editPastData",
      params: {
        data: JSON.stringify(info),
      },
    });
  } 

  const hideWidget = () => {
    const visibleWidgets = user.tracking.visibleWidgets;
    const ind = visibleWidgets.indexOf(widget.category)
    if (ind < 0) return router.back();
    
    visibleWidgets.splice(ind, 1);
    
    updateUser({tracking: { visibleWidgets: visibleWidgets}});
    router.back();
  }

  
  
  

  return (
    <ThemedView style={styles.container}>
      
      <SafeAreaView style={{flex: 1,  marginBottom: -50}}>
        <TitleWithBack title={firstCapital(widget.category)} style={{marginLeft: -20}} actionBtn={{actionMenu: true, image: require("../../assets/icons/threeEllipses.png"), options: [{title: "Edit past data", icon: pencilIcon, onPress: () => openEditPastData(),}, {title: "Hide widget", icon: noEye, onPress: () => hideWidget(),}]}} />
        <Spacer height={20} />
        <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>


          {widget.layout === "weight" && (
            <View style={{width: "100%", alignItems: "center"}}>
              {/* Top pencil and value */}
              <Pressable onPress={clickValue} style={{flexDirection: "row", justifyContent: "center", alignItems: "center", height: 60,}}>
                  <View style={{height: 60, width: 40, justifyContent: "center", alignItems: "center"}}>
                    <Image source={pencilIcon} style={{height: 12, width: 12}} />
                  </View>
                  <ThemedText title={true} style={{height: 60, fontSize: 40, fontWeight: "bold", borderColor: "blue", marginTop: 10}}>{mostRecentValue}</ThemedText>
                  <ThemedText style={{height: 60, fontSize: 20, fontWeight: '300', borderColor: "blue", marginTop: 47, marginLeft: 10}}>{widget.unit}</ThemedText>
              </Pressable>
              <Spacer height={50} />
              {/* Extra data */}
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                {/* Current */}
                <View style={{height: 100, width: (screenWidth-80)/3, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                  <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Current</ThemedText>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{mostRecentValue}</ThemedText>
                  </View>
                  
                </View>
                {/* Goal */}
                <Pressable onPress={clickGoal}>
                  <View style={{height: 100, width: (screenWidth-80)/3, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Goal</ThemedText>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", height: 20,}}>
                        <View style={{width: 20, height: 20, justifyContent: "center", alignItems: "center", marginLeft: -10}}>
                          <Image source={pencilIcon} style={{height: 10, width: 10, objectFit: "contain"}} />
                        </View>
                        <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, height: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{widget.extraData?.goal || "- -"}</ThemedText>
                      </View>
                    </View>
                    
                    
                  </View>
                </Pressable>
                
                {/* Last recorded */}
                <View style={{height: 100, width: (screenWidth-80)/3, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                  <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Last recorded</ThemedText>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={showYear ? 2 : 1} style={{fontSize: showYear ? 16 : 20, textAlign: "center", color: "white", fontWeight: '800'}}>{mostRecentDate ? new Date( mostRecentDate).toLocaleDateString('en-US', {month: "short", day: "numeric", ...showYearOptions}) : "- -"}</ThemedText>
                  </View>
                  
                </View>
              </View> 

            </View>
          )}
          

          <View style={{marginTop: 20, flex: 1, }}>
            <GraphWidget
              
              data={widget.data.map((item) => item.amount)}
              dates={widget.data.map((item) => item.date)}
              title={firstCapital(widget.category)}
              unit={widget.unit}
              color={widget.color || "#546FDB"}
              fullWidget={true}
              
            />
          </View>





          {widget.layout === "bmi" && (
            <View>
              <ThemedText style={{fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: "center"}}>Breakdown of your current BMI</ThemedText>

              <View style={{width: "100%", borderRadius: 10, overflow: "hidden"}}>
                <View style={{backgroundColor: bmiSectionIndex===0 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                  <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===0 ? '800' : '300' }}>Underweight</Text>
                  <View style={{width: "40%", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===0 ? '800' : '300'}}>Below 18.5</Text>
                  </View>
                </View>
                <View style={{backgroundColor: bmiSectionIndex===1 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                  <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===1 ? '800' : '300' }}>Healthy</Text>
                  <View style={{width: "40%", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===1 ? '800' : '300'}}>18.5 - 24.9</Text>
                  </View>
                </View>
                <View style={{backgroundColor: bmiSectionIndex===2 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                  <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===2 ? '800' : '300' }}>Overweight</Text>
                  <View style={{width: "40%", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===2 ? '800' : '300'}}>25.0 – 29.9</Text>
                  </View>
                </View>
                <View style={{backgroundColor: bmiSectionIndex===3 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                  <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===3 ? '800' : '300' }}>Obesity</Text>
                  <View style={{width: "40%", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===3 ? '800' : '300'}}>30.0 or above</Text>
                  </View>
                </View>

              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

export default ProgressExpanded

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
})

// // parent
// import { router } from "expo-router";
// import { EventEmitter } from "expo-modules-core";

// export const emitter = new EventEmitter();

// function Parent() {
//   useEffect(() => {
//     const sub = emitter.addListener("done", (data) => {
//       console.log("Got data back:", data);
//     });
//     return () => sub.remove();
//   }, []);

//   return (
//     <Button
//       title="Go to child"
//       onPress={() => router.push("/child")}
//     />
//   );
// }





// // child
// import { emitter } from "./Parent";

// export default function Child() {
//   return (
//     <Button
//       title="Finish"
//       onPress={() => {
//         emitter.emit("done", { result: 42 });
//         router.back();
//       }}
//     />
//   );
// }
