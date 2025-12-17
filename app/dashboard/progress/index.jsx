import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import BlueButton from '../../../components/BlueButton'
import { router } from 'expo-router'
import { useUserStore } from '../../../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import GraphWidget from '../../../components/GraphWidget'
import Spacer from '../../../components/Spacer'
import plusIcon from '../../../assets/icons/plus.png'
import gripDots from '../../../assets/icons/gripDots.png'
import noEye from '../../../assets/icons/noEye.png'
import whiteX from '../../../assets/icons/whiteX.png'
import { Colors } from '../../../constants/Colors'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { Portal } from 'react-native-paper'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ActionMenu from '../../../components/ActionMenu'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { ScrollView } from 'react-native-gesture-handler'
import calculateExpenditure, { useCalculateExpenditure } from '../../../util/calculateExpenditure'
import NutritionWidget from '../../../components/nutrition/NutritionWidget'
import calculateBMI from '../../../util/calculateBMI'
import getAllExercises from '../../../util/getAllExercises'


const firstCapital = (string) => {
  const strToArr = string.split(' ');
  const newArr = strToArr.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return newArr.join(' ');
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [addExerciseWidget, setAddExerciseWidget] = useState(false);

  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState();


  const openProgressExpanded = (category, categoryData) => {

    const data = {
      category,
      ...categoryData
    }

    router.push({
      pathname: "/progressExpanded",
      params: {
        data: JSON.stringify(data),
        fillDaily: categoryData.fillDaily ?? null,
      },
    });
  } 

  const openProgressExpandedExercise = (exercise, exerciseData) => {
    const data = {
      layout: "exercise",
      category: exercise.name,
      data: exerciseData,
      color: Colors.primaryOrange,
    }
    router.push({
      pathname: "/progressExpanded",
      params: {
        data: JSON.stringify(data),
        fillDaily: "last",
      },
    });
  }

  const openNutrition = () => {
    router.push({
      pathname: "/nutrition",
    });
  }

  const updatedVisibleWidgets = user.tracking.visibleWidgets || [];
  const widgets = ["nutrition", "weight", "sleep amount", "sleep quality", "water intake"];
  const widgetsAvailable = widgets.filter(w => !updatedVisibleWidgets.includes(w));
  
  const visibleExerciseWidgetIds = updatedVisibleWidgets.map(w => {
    if (w.length >= 3 && w.slice(0, 3) === "ex_") {
      return w.slice(3, w.length);
    } else return null;
  }).filter(o => o !== null);

  const allExercises = getAllExercises(user, "name")
  const exerciseWidgetsAvailable = allExercises.filter(ex => !visibleExerciseWidgetIds.includes(ex.id));

  const selectAddExerciseWidget = (ex) => {
    if (visibleExerciseWidgetIds.includes(ex.id)) return;
    const updated = ["ex_" + ex.id, ...updatedVisibleWidgets];
    updateUser({tracking: { visibleWidgets: updated}});
    setAddExerciseWidget(false);
  }

  const selectAddWidget = (wid) => {
    const visibleWidgets = updatedVisibleWidgets;

    const updated = [wid, ...visibleWidgets]; // clone, don’t mutate
    
    updateUser({ tracking: { visibleWidgets: updated } });
  };

  const requestHideWidget = (wid) => {
    setConfirmMenuData({
                title: "Hide this widget?",
                subTitle: "This widget can always be added back later.",
                subTitle2: "",
                option1: "Confirm hide",
                option1color: "#DB5454",
                option2: "Go back",
                confirm: () => hideWidget(wid),
            });
            setConfirmMenuActive(true);
  }
    
  const hideWidget = (wid) => {
      const visibleWidgets = updatedVisibleWidgets;
      const ind = visibleWidgets.indexOf(wid)
      if (ind < 0) return router.back();
      
      visibleWidgets.splice(ind, 1);
      
      updateUser({tracking: { visibleWidgets: visibleWidgets}});
    }

  const setVisibleWidgetsFlatlistData = (data) => {
    //const newVisibleWidgets = data.map(d => d.key);
    // updateUser({tracking: {visibleWidgets: newVisibleWidgets}});
    updateUser({tracking: {visibleWidgets: data}});
  }

  
  if (!updatedVisibleWidgets.includes("nutrition")) updatedVisibleWidgets.unshift("nutrition");


  const visibleWidgetsFlatlistDataObject = {};
  updatedVisibleWidgets.forEach((key, i) => {

          

          if (key === "nutrition") {
            return visibleWidgetsFlatlistDataObject[key] = {
              key,
              height: (screenWidth-60)/2,
              width: screenWidth - 40,
            };
          }
          const widget = user.tracking.logging[key];
          return  visibleWidgetsFlatlistDataObject[key] = {
            key,
            height: 205 + 20, // 20 margin bottom
            width: screenWidth - 40,
            widget,
          };
        });

  const pWidgetActionMenuData = widgetsAvailable.map(w => {
    return {
      title: firstCapital(w),
      onPress: () => selectAddWidget(w),
    }
  });

  //const widgetActionMenuData = widgetActionMenuData.length === 0 ? [{title: "No more availbe widgets", onPress: () => {}}] : widgetActionMenuData;
  const widgetActionMenuData = [{title: "Add Exercise Progress", onPress: () => {setAddExerciseWidget(true)}}, ...pWidgetActionMenuData];





  const expenditureData = calculateExpenditure(user);
  const bmiData = calculateBMI([], [], user); // Two blank arrays, all data is dynamic

  return (

    <ThemedView style={styles.container}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
        <SafeAreaView style={{flex: 1}}>

        {addExerciseWidget && (
            <Portal >
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >
                <Pressable onPress={() => setAddExerciseWidget(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>
                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    
                    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.addWidgetCont]}>

                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start", }}>
                        <Pressable onPress={() => setAddExerciseWidget(false)}>
                            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 20}} />
                        </Pressable>
                        
                        <Text adjustsFontSizeToFit style={[styles.screenText, { flex: 1, }]}>Add Exercise Widget</Text>

                        <View style={{width: 80}}></View>
                      </View>

                      <Spacer height={20} />

                      <ScrollView style={{width: "100%", maxHeight: screenHeight-300, borderRadius: 10, overflow: "hidden"}}>
                        {exerciseWidgetsAvailable.map((ex, i) => (
                          <Pressable key={i} onPress={() => selectAddExerciseWidget(ex)} style={{backgroundColor:  "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            <Text style={{color: "white", fontSize: 17, fontWeight:'800'  }}>{firstCapital(ex.name)}</Text>
                            
                          </Pressable>
                        ))}

                      </ScrollView>
                      <Spacer height={20} />
                    
                    </Animated.View>

                  </Animated.View>
                  
              </Animated.View>
            </Portal>
            
          )}

            
            <DraggableFlatList
              ListHeaderComponent={
                <>
                <ThemedText style={[styles.header, {marginTop: 20, fontSize: 20,  textAlign: 'center'}]}>Progress</ThemedText>
                <Spacer height={40} />
                

                

                  {/* Add widget button*/}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginRight: 20}}>
                  <ThemedText style={[styles.header, {fontSize: 15}]} >Logging & Tracking</ThemedText>
                  {/* <Pressable onPress={() => setAddWidget(true)} style={{flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: Colors.primaryBlue, borderRadius: 50, height: 30, paddingHorizontal: 10}} >
                    <View style={{height: 20, width: 20, justifyContent: "center", alignItems: "center", marginRight: 10}}>
                      <Image style={{height: 20, width: 20, objectFit: 'contain'}} source={plusIcon} />
                    </View>
                    <Text style={{fontSize: 15, color: "white", fontWeight: 600}}>Add widget</Text>
                  </Pressable> */}
                  <ActionMenu data={widgetActionMenuData} backgroundColor={Colors.primaryBlue} title={"Add widget"} icon={plusIcon} style={{paddingVertical: 5, paddingHorizontal: 10, borderRadius: 50}} />
                </View>
                

                <Spacer height={20} />
                </>
              }
              contentContainerStyle={{paddingBottom: 220}}
              showsVerticalScrollIndicator={false}
              // nestedScrollEnabled={true}
              data={updatedVisibleWidgets}
              onDragEnd={({data}) => setVisibleWidgetsFlatlistData(data)}
              keyExtractor={(item) => item} // item.key if object
              
              renderItem={({item, drag, isActive}) => {
                item = visibleWidgetsFlatlistDataObject[item];

                if (item.key.length >= 3 && item.key.slice(0, 3) === "ex_") {
                  const exerciseId = item.key.slice(3, item.key.length);
                  const completedExercises = user.completedExercises[exerciseId] || [];
                  const exercise = allExercises.find(e => e.id === exerciseId);
                  const weightOrDistance = (exercise.tracks.includes("weight") || exercise.tracks.includes("weightPlus"));

                  const bestData =  completedExercises.map((exer, ind) => {
                    let highestAmount = 0;
                    let highestAmountIndex = 0;
                    exer.sets.forEach((s, i) => {
                        const group = exer.tracks.includes("weight") ? "strength" : exer.tracks.includes("weightPlus") ? "strengthPlus" : (exer.tracks.includes("mile") && exer.tracks.includes("time")) ? "cardio" : exer.tracks.includes("mile") ? "distance" : exer.tracks.includes("reps") ? "repsOnly" : null;
                        const track = group === "strength" ? "weight" : group==="strengthPlus" ? "weightPlus" : group==="cardio" ? "mile" : group==="distance" ? "mile" : group==="repsOnly" ? "reps" : null;
                        const value = track ? parseFloat(s[track]) : 0;
                        if (value > highestAmount) {
                            highestAmountIndex = i;
                            highestAmount = value;
                        }
                    });
                    const bestSet = exer.sets[highestAmountIndex];
                    let returnValue = "";
                    if (exer.tracks.includes("mile")) returnValue = `${highestAmount} miles`;
                    else if (exer.tracks.includes("weight") || exer.tracks.includes("weightPlus")) returnValue = `${highestAmount} lbs`;
                    if (exer.tracks.includes("reps")) returnValue += ` x${bestSet["reps"]}`;
                    return {date: exer.date, amount: highestAmount, unit: exer.unit}
                    
                  });

                  return (
                  <ScaleDecorator key={item.key}>
                    {/* Grip drag */}
                    <Pressable onPressIn={drag} style={{height: 30, width: 30, zIndex: 2, justifyContent: "center", alignItems: "center", position: "absolute", top: 5, left: 25}}>
                      <Image source={gripDots} style={{objectFit: "contain", height: 13, width: 30, tintColor: "#acacacff", }} />
                    </Pressable>
                    {/* Hide widget */}
                    <Pressable onPress={() => requestHideWidget(item.key)} style={{height: 30, width: 30, zIndex: 2, justifyContent: "center", alignItems: "center", position: "absolute", top: 5, right: 25}}>
                      <Image source={noEye} style={{objectFit: "contain", height: 17, width: 30, tintColor: "white", }} />
                    </Pressable>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => openProgressExpandedExercise(exercise, bestData)}
                      style={{width: item.width, marginHorizontal: 20}}
                    >
                      {/* Save as OpenExercise here */}
                      {completedExercises.length < 1 === true ? (
                        // No completed exercises
                        <GraphWidget
                            data={[0]}
                            dates={[Date.now(), Date.now()]}
                            title={"       " + exercise.name}
                            unit={""}
                            color={Colors.primaryOrange}
                            style={{marginBottom: 20}}
                            fillWidth={true}
                            disablePress={true}
                          />
                      ) : (
                        // Show completed exercise widgets
                        <GraphWidget
                          data={bestData.map((item) => {
                            if (item.unit === 'metric') {
                              return weightOrDistance ? kgToLbs(item.amount) : kmToMiles(item.amount);
                            } else {
                              return item.amount
                            }
                            
                          })}
                          dates={bestData.map((item) => item.date)}
                          title={"       "+exercise.name}
                          unit={weightOrDistance ? "lbs" : "miles"}
                          color={Colors.primaryOrange}
                          style={{marginBottom: 20}}
                          fillWidth={true}
                          disablePress={true}
                          fillDaily={"last"}
                        />
                      )}


                    </TouchableOpacity>
                  </ScaleDecorator>
                )}

                if (item.key === "nutrition") return (
                  <ScaleDecorator key={item.key}>
                    {/* Grip drag */}
                    <Pressable onPressIn={drag} style={{height: 30, width: 30, zIndex: 2, justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 25}}>
                      <Image source={gripDots} style={{objectFit: "contain", height: 13, width: 30, tintColor: "#acacacff", }} />
                    </Pressable>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => openNutrition()}
                      style={{width: item.width, marginHorizontal: 20}}
                    >
                    <NutritionWidget
                      style={{marginBottom: 20}} drag={drag}
                    />
                    </TouchableOpacity>
                  </ScaleDecorator>
                ) 

                const widget = item.widget;
                const key = item.key;
                const data = widget.data.map(it => it.amount);
                const dates = widget.data.map(it => it.date);
                widget.calculatedData = data;
                widget.calculatedDates = dates;
                widget.fillDaily = "last";

                
                if (key === 'water intake') {
                  widget.fillDaily = "zero";
                  // If last item of data is not from today, add a 0 value for today - Dont need from fillDailyData
                  // const today = new Date();
                  // const lastDate = dates[dates.length -1] ? new Date(dates[dates.length -1]) : null;
                  // if (!lastDate || lastDate.toDateString() !== today.toDateString()) {
                  //   widget.calculatedData = [...data, 0];
                  //   widget.calculatedDates = [...dates, today.toISOString()];
                  //   
                  // }
                }
                if (key === "sleep amount") {
                  widget.fillDaily = "zero";
                }

                return (
                  
                  <ScaleDecorator key={item.key}>
                    {/* Grip drag */}
                    <Pressable onPressIn={drag} style={{height: 30, width: 30, zIndex: 2, justifyContent: "center", alignItems: "center", position: "absolute", top: 5, left: 25}}>
                      <Image source={gripDots} style={{objectFit: "contain", height: 13, width: 30, tintColor: "#acacacff", }} />
                    </Pressable>
                    {/* Hide widget */}
                    <Pressable onPress={() => requestHideWidget(item.key)} style={{height: 30, width: 30, zIndex: 2, justifyContent: "center", alignItems: "center", position: "absolute", top: 5, right: 25}}>
                      <Image source={noEye} style={{objectFit: "contain", height: 17, width: 30, tintColor: "white", }} />
                    </Pressable>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => openProgressExpanded(item.key, widget)}
                      style={{width: item.width, marginHorizontal: 20}}
                    >
                    <GraphWidget
                      fillWidth={true}
                      data={widget.calculatedData}
                      dates={widget.calculatedDates}
                      title={"       " +firstCapital(item.key)}
                      unit={widget.unit}
                      color={widget.color || "#546FDB"}
                      style={{marginBottom: 20}}
                      disablePress={true}
                      fillDaily={widget.fillDaily}
                    />
                    </TouchableOpacity>
                  </ScaleDecorator>
                )
              }}
              ListFooterComponent={
                <>
                  <Animated.View layout={LinearTransition.springify().damping(90)}>
                    <Spacer height={20} />
                    <ThemedText style={[styles.header, { fontSize: 15}]} >Insights</ThemedText>

                    {/* INSIGHTS */}
                    <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}} >
                      {Object.keys(user.tracking.insights).map((key, index) => {
                        const widget = user.tracking.insights[key];

                        
                        const calResting = ((user.tracking.logging["weight"].data.length > 0) && user.settings.height !== null && user.settings.gender !==null && user.settings.birthday !== null) === true; // True if use has their: weight, height, gender, and age
                        const calExercising = user.tracking.logging["weight"].data.length > 0 === true; // True if body: weight
                        const calWalkingSteps = calExercising && false; // True if: weight, and access to step count
                        const calFood = true; // True when finished developing meals
                        const blockExpenditure = key === "expenditure" && ( !calResting || !calExercising || !calFood);
                        widget.calResting = calResting;
                        widget.calExercising = calExercising;
                        widget.calWalkingSteps = calWalkingSteps;
                        widget.calFood = calFood;
                        widget.blockExpenditure = blockExpenditure;
                        
                        const data = widget.data.map(it => it.amount);
                        const dates = widget.data.map(it => it.date);

                        widget.calculatedData = data;
                        widget.calculatedDates = dates;

                        if (key === 'expenditure') {
                          widget.calculatedData = expenditureData.data;
                          widget.calculatedDates = expenditureData.dates;
                        }
                        if (key === 'BMI') {
                          widget.calculatedData = bmiData.data;
                          widget.calculatedDates = bmiData.dates;
                        }
                        

                        return  (
                          <View key={key} >
                            <GraphWidget
                              key={index}
                              data={widget.calculatedData}
                              dates={ widget.calculatedDates}
                              title={firstCapital(key)}
                              unit={widget.unit}
                              color={widget.color || "#546FDB"}
                              onPress={() => openProgressExpanded(key, widget)}
                              showWarning={widget.blockExpenditure}
                              showDecimals={key === "expenditure" ? 0 : 2}
                            />
                          </View>
                          
                        ) 
                      })}
                    </ScrollView>
                  </Animated.View>
                </>
              }
            />

        </SafeAreaView>
    </ThemedView>
    
  )
}

export default IndexProgress

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 700,
      paddingHorizontal: 20,
    },
    widgets: {
      flexDirection: 'row',
      marginTop: 20,
      width: screenWidth,
    },
    addWidgetCont: {
        backgroundColor: "#282828",
         borderRadius: 20,
         padding: 10,
         paddingBottom: 0,
         minHeight: 100,
        //  maxHeight: screenHeight,
         overflow: 'hidden',
    },
    screenText: {
          color: "white", 
          fontSize: 16, 
          textAlign: 'center',
      },
    
  })