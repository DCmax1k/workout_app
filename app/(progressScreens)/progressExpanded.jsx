import { Dimensions, Image, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'

import { router, useLocalSearchParams } from 'expo-router'
import TitleWithBack from '../../components/TitleWithBack'
import GraphWidget from '../../components/GraphWidget'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spacer from '../../components/Spacer'
import pencilIcon from '../../assets/icons/pencil.png'
import noEye from '../../assets/icons/noEye.png'
import { useEffect, useState } from 'react'
import { useUserStore } from '../../stores/useUserStore'
import ConfirmMenu from '../../components/ConfirmMenu'
import emitter from '../../util/eventBus';
import ProgressBar from '../../components/ProgressBar'
import ExpenditureBreakdown from '../../components/extra/ExpenditureBreakdown'
import sinceWhen from '../../util/sinceWhen'
import findInsertIndex from '../../util/findInsertIndex'
import fillDailyData from '../../util/fillDailyData'
import sendData from '../../util/server/sendData'
import { useBottomSheet } from '../../context/BottomSheetContext'
import calculateCalories from '../../util/calculateNutrition/calculateCalories'
import calculateProtein from '../../util/calculateNutrition/calculateProtein'
import calculateCarbs from '../../util/calculateNutrition/calculateCarbs'
import calculateFat from '../../util/calculateNutrition/calculateFat'
import { Colors } from '../../constants/Colors'
import calculateExpenditure from '../../util/calculateExpenditure'
import EnergyBalanceGraph from '../../components/nutrition/EnergyBalanceGraph'
import ImageContain from '../../components/ImageContain'

const screenWidth = Dimensions.get('screen').width;

const BMI_IMAGES = {
  underweight: require('../../assets/bmi/underweight.svg'),
  normal: require('../../assets/bmi/normal.svg'),
  overweight: require('../../assets/bmi/overweight.svg'),
  obese: require('../../assets/bmi/obese.svg'),
  extremely: require('../../assets/bmi/extremely.svg'),

  gradient: require('../../assets/bmi/gradient.svg'),
};

const firstCapital = (str = '') =>
  str
    .replace(/\b\w/g, char => char.toUpperCase());


const ProgressExpanded = () => {
  const {showAlert} = useBottomSheet();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const params = useLocalSearchParams();
  const w = JSON.parse(params.data);

  const wi = user.tracking.logging[w.category] || user.tracking.insights[w.category] || w;

  console.log(w.data);

  const fillDaily = params.fillDaily ?? null;

  let widget;
  if (w.layout === 'blank') {
    widget = w;
  } else {
    widget = {
      category: w.category,
      menuOptions: w.menuOptions,
      ...wi,
    }
  }

  


  const pushLoggingWeightLayoutServer = async (category, obj) => {
    // Push to server
    const response = await sendData("/dashboard/pushloggingweightlayout", {category, obj, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") {
      showAlert(response.message, false);
      return;
    }
  }
  const saveLoggingGoalServer = async (category, value) => {
    // Push to server
    const response = await sendData("/dashboard/savelogginggoal", {category, value, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") {
      showAlert(response.message, false);
      return;
    }
  }

  useEffect(() => {
    const sub = emitter.addListener("done", (data) => {
      //console.log("Got data back:", data);
      if (data.widget.layout === "weight") { // Push new data point with new date
        if (data.target === "value") {
          
          const cData = user.tracking.logging[data.widget.category].data;
          const newTime = data.timeAndDate.getTime() ?? new Date().getTime();
          const obj = {date: newTime, amount: data.value}
          pushLoggingWeightLayoutServer(data.widget.category, obj);
          if (cData.length === 0 || new Date(cData[cData.length -1].date).getTime() < new Date(newTime).getTime()) {
            cData.push(obj);
          } else {
            const idx = findInsertIndex(cData.map(d => d.date), newTime);
            cData.splice(idx, 0, obj);
          }
          //const cData = [...nData, {date: Date.now(), amount: data.value}];
          const updated = {tracking: {logging: {[data.widget.category]: {data: cData}}}};
          updateUser(updated);
          
          //console.log("updated ", updated);
        } else if (data.target === 'goal') {
          saveLoggingGoalServer(data.widget.category, data.value);
          const updated = {tracking: {logging: {[data.widget.category]: {extraData: {goal: data.value}}}}};
          updateUser(updated);
        } 
        

      } else if (data.widget.layout === "water") { // Edit last data point if the last point is 
        if (data.target==="goal") {
          saveLoggingGoalServer(data.widget.category, data.value);
          const updated = {tracking: {logging: {[data.widget.category]: {extraData: {goal: data.value}}}}};
          updateUser(updated);
        } else if (data.target === "valueToAdd") {
          updateUser({tracking: {logging: {[data.widget.category]: {extraData: {valueToAdd: data.value}}}}});

        }
      }
    });
    return () => sub.remove();
  }, [emitter, updateUser, user]);

  let mostRecentValue = widget.data[widget.data.length - 1]?.amount || 0;
  let mostRecentDate = widget.data[widget.data.length - 1]?.date || null;
  const lastRecorded = mostRecentDate;
  console.log("Last recorded", sinceWhen(lastRecorded));
  if (widget.calculatedData) {
    const {dataAmounts: newAmounts, dataDates: newDates} = fillDailyData(widget.calculatedData, widget.calculatedDates, new Date(), fillDaily);
    mostRecentValue = newAmounts[0] || 0;
    mostRecentDate = newDates[0];
  }
  


  // Replaed with fillDailyData
  // if (widget.layout === "water") {
  //   const mostRecentDte = new Date(mostRecentDate);
  //   const tdDte = new Date();
  //   // NEEDS VERIFICATION IF THIS WORKS
  //   if (mostRecentDte.getTime() < tdDte.getTime() && mostRecentDte.toLocaleDateString() !== tdDte.toLocaleDateString()) {
  //     mostRecentValue = 0;
  //     mostRecentDate = new Date().getTime();
  //   }
  // }
  

  //console.log(widget);

  // let bmiSectionIndex = -1 ;
  let bmiMarkerLeftPercentage = "0%";
  if (widget.layout === 'bmi') {
    if (mostRecentValue >= 40) bmiMarkerLeftPercentage = "100%"
    else if (mostRecentValue <= 15) bmiMarkerLeftPercentage = "0%"
    else bmiMarkerLeftPercentage = (((mostRecentValue-15)/25) * 100) + "%";
    // Old design
    // if ( mostRecentValue < 18.5 ) {
    //   bmiSectionIndex = 0;
    // } else if (mostRecentValue >= 18.5 && mostRecentValue < 25) {
    //   bmiSectionIndex = 1;
    // } else if (mostRecentValue >= 25 && mostRecentValue < 30) {
    //   bmiSectionIndex = 2;
    // } else if (mostRecentValue >= 30) {
    //   bmiSectionIndex = 3;
    // }
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
      options: {
        showTime: true,
        showDate: true,
        defaultDate: Date.now(),
      },
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

  const clickValueToAdd = () => {
    const info = {
      title: widget.category,
      target: 'valueToAdd',
      value: widget.extraData.valueToAdd,
      unit: widget.unit,
      widget,
      increment: 0.1,
      range: [0, 100],
      scrollItemWidth: 10,
      defaultValue: 1,
    }
    router.push({
      pathname: "/inputValueScreen",
      params: {
        data: JSON.stringify(info),
      },
    });
  }

  const addLoggingWaterLayoutServer = async (category, valueToAdd) => {
    const response = await sendData("/dashboard/addloggingwaterlayout", {category, valueToAdd, jsonWebToken: user.jsonWebToken});
    if (response.status !== "success") {
      showAlert(response.message, false);
      return;
    }
  }

  const addToToday = () => {
    //const currentTime = Date.now();
    const valueToAdd = widget.extraData.valueToAdd;
    // const data = widget.data;
    // const lastEntry = data[data.length-1];
    // let newData = JSON.parse(JSON.stringify(data));
    // if (data.length > 0) {
    //     const isSameDayAsLastEntry =  new Date(lastEntry.date).toDateString() === new Date(currentTime).toDateString();
    //     if (isSameDayAsLastEntry) {
    //         newData[newData.length-1] = {date: lastEntry.date, amount: lastEntry.amount+valueToAdd};
    //     } else {
    //         newData.push({date: currentTime, amount: valueToAdd});
    //     }
    // } else {
    //     newData.push({date: currentTime, amount: valueToAdd});
    // }
    // updateUser({tracking: {logging: {[widget.category]: {data: newData}}}});

    // Updated to update today, today isnt always the last entry - TESTING
    addLoggingWaterLayoutServer(widget.category, valueToAdd);
    const currentTime = new Date();
    const cData = widget.data;
    const newTime = currentTime.getTime();
    const dataEntriesOnDate = widget.data.filter(k => new Date(k.date).toDateString() === currentTime.toDateString());
    if (dataEntriesOnDate.length > 0) {
        // Edit existing entry
        const entryToEdit = dataEntriesOnDate[0];
        const entryIndex = cData.findIndex(e => e.date === entryToEdit.date);
        const obj = {date: newTime, amount: valueToAdd+entryToEdit.amount};
        
        cData[entryIndex] = obj;
        updateUser({tracking: {logging: {[widget.category]: {data: cData}}}});
    } else {
        // Add new entry
        if (cData.length === 0 || new Date(cData[cData.length -1].date).getTime() < new Date(newTime).getTime()) {
          const obj = {date: newTime, amount: valueToAdd};
          cData.push(obj);

        } else {
          const idx = findInsertIndex(cData.map(d => d.date), newTime);
          const obj = {date: newTime, amount: valueToAdd};
          cData.splice(idx, 0, obj);

        }
        updateUser({tracking: {logging: {[widget.category]: {data: cData}}}});
    }
  }

  const hideWidget = () => {
      const visibleWidgets = user.tracking.visibleWidgets;
      const ind = visibleWidgets.indexOf(widget.category)
      if (ind < 0) return router.back();
      
      visibleWidgets.splice(ind, 1);
      
      updateUser({tracking: { visibleWidgets: visibleWidgets}});
      router.back();
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

  

  const menuOptions = widget.layout === "weight" ? 
      [{title: "Edit past data", icon: pencilIcon, onPress: () => openEditPastData(),}, {title: "Hide widget", icon: noEye, onPress: () => hideWidget(),}]
      : widget.layout === "water" ? 
      [{title: "Edit past data", icon: pencilIcon, onPress: () => openEditPastData(),}, {title: "Hide widget", icon: noEye, onPress: () => hideWidget(),}]
      : [];
  
  let yesterdayValue = null;
  if (widget.layout === 'water') {
    
    // Calculating yesterdays value
    const yesterdayDate = new Date();
    const threeDaysAgo = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    for (let i=widget.data.length-1; i>=0; i--) {
      const dDate = new Date(widget.data[i].date);
      if (dDate.getTime() < threeDaysAgo.getTime()) { // Check if already past yesterday so just cancel
        console.log("Cancelled because past")
        i = -1;
      }
      if (dDate.toLocaleDateString() === yesterdayDate.toLocaleDateString()) {
        yesterdayValue = widget.data[i].amount;
        i=-1;
      }

    }
  }

  
  if (widget.layout === "calorie") {
    const calorieCalculation = calculateCalories(user, 30 * 6);
    widget.calculatedData = calorieCalculation.data;
    widget.calculatedDates = calorieCalculation.dates;

    widget.unit = "kcal";

    const proteinCount = calculateProtein(user, 30*6);
    widget.proteinData = proteinCount.data;
    widget.proteinDates = proteinCount.dates;
    
    const carbCount = calculateCarbs(user, 30*6);
    widget.carbData = carbCount.data;
    widget.carbDates = carbCount.dates;
    
    const fatCount = calculateFat(user, 30*6);
    widget.fatData = fatCount.data;
    widget.fatDates = fatCount.dates;
    
  }

  if (widget.layout === "energy balance") {
    const calorieCalculation = calculateCalories(user, 30 * 6);
    widget.calorieData = calorieCalculation.data;
    widget.calorieDates = calorieCalculation.dates;

    const expenditureCalculation = calculateExpenditure(user);
    widget.expenditureData = expenditureCalculation.data;
    widget.expenditureDates = expenditureCalculation.dates;
  }

  let calResting = false;
  let calExercising = false;
  let calWalkingSteps = false;
  let calFood = false;
  let blockExpenditure = false; 
  if (widget.category === 'expenditure') {
    calResting = widget.calResting;
    calExercising = widget.calExercising;
    calWalkingSteps = widget.calWalkingSteps;
    calFood = widget.calFood;
    blockExpenditure = widget.blockExpenditure;
  }

  
  return (
    <ThemedView style={styles.container}>
      
      <SafeAreaView style={{flex: 1,  marginBottom: -50}}>
        <TitleWithBack title={firstCapital(widget.category)} style={{marginLeft: -20}} actionBtn={{actionMenu: true, image: require("../../assets/icons/threeEllipses.png"), options: menuOptions}} />
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
                <Pressable onPress={clickValue} style={{height: 100, width: (screenWidth-80)/3, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                  <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Current</ThemedText>
                  <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{mostRecentValue}</ThemedText>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 10, height: 20, textAlign: "center", marginTop: 15, marginLeft: 3, color: "#979797", fontWeight: '800'}}>{widget.unit}</ThemedText>
                  </View>
                  
                </Pressable>
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
                  <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Last Recorded</ThemedText>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, textAlign: "center", color: "white", fontWeight: '800'}}>{lastRecorded ? sinceWhen(lastRecorded) : "- -"}</ThemedText>
                  </View>
                  
                </View>
              </View> 

            </View>
          )}

          {widget.layout === "water" && (
            <View style={{width: "100%", alignItems: "center"}}>
              {/* Subheader and progress bar */}
              <ThemedText>Todays water consumption</ThemedText>
              <Spacer height={10} />
              <View style={{flex: 1, justifyContent: "center", alignItems: "flex-end", flexDirection: "row"}}>
                <ThemedText style={{fontSize: 22, color: "white", fontWeight: "800"}}>{`${parseInt((mostRecentValue*10))/10} / ${widget.extraData.goal}`}</ThemedText>
                <ThemedText style={{fontSize: 15, color: "#A6A6A6", fontWeight: "300", marginBottom: 2}}>{` ${widget.unit}`}</ThemedText>
              </View>
              
              <Spacer height={20} />
              <ProgressBar value={mostRecentValue || 0} goal={widget.extraData.goal || 0} color={widget.color} />
              <Spacer height={20} />
              {/* Input and submit button */}
              <View style={{width: screenWidth-40, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <Pressable onPress={clickValueToAdd} style={{width: (screenWidth-40-20)/2, height: 60, borderRadius: 10, backgroundColor: "#3C3C3C", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, }}>
                  <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>{widget.extraData.valueToAdd}</Text>
                  <Text style={{color: "#717171", fontSize: 20}}>{widget.unit}</Text>
                </Pressable>
                
                <Pressable onPress={addToToday} style={{width: (screenWidth-40-20)/2, height: 60, borderRadius: 10, backgroundColor: widget.color, overflow: "hidden"}}>
                  <View style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.15)"}}>
                    <Text style={{color: "white", fontSize: 20,  fontWeight: "600"}}>Add to today</Text>
                  </View>
                </Pressable>
              </View> 

              <Spacer height={20} />
              {/* Extra data */}
              <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
                {/* Yesterday */}
                <View style={{height: 100, width: (screenWidth-80)/3, backgroundColor: "#3A3A3A", borderRadius: 10, flexDirection: "column", alignItems: "center", paddingHorizontal: 10}}>
                  <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 16, marginTop: 10, textAlign: "center"}}>Yesterday</ThemedText>
                  <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row", paddingBottom: 10}}>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 20, textAlign: "center", color: "white", fontWeight: '800'}}>{yesterdayValue ? yesterdayValue : "- -"}</ThemedText>
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize: 10, height: 20, textAlign: "center", marginTop: 15, marginLeft: 3, color: "#979797", fontWeight: '800'}}>{widget.unit}</ThemedText>
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
                    <ThemedText adjustsFontSizeToFit={true} numberOfLines={1} style={{fontSize:  16, textAlign: "center", color: "white", fontWeight: '800'}}>{lastRecorded ? sinceWhen(lastRecorded) : "- -"}</ThemedText>
                  </View>
                  
                </View>
              </View> 

            </View>
          )}

          {widget.layout === "energy balance" ? (
            <View style={{marginTop: 20, flex: 1, }}>
              <EnergyBalanceGraph
                  fullWidget={true}
                  data={widget.expenditureData}
                  dates={widget.expenditureDates}
                  calorieData={widget.calorieData}
                  calorieDates={widget.calorieDates}
                  title={"Energy Balance"}
                  color={Colors.primaryOrange}
                  disablePress={true}
                  titleStyles={{fontWeight: "800", color: "white", fontSize: 16, marginBottom: -3}}
                  hideFooter={true}
                  animationDuration={0}
              />
            </View>
          ) : (
            <View style={{marginTop: 20, flex: 1, }}>
              <GraphWidget
                
                data={widget.calculatedData || widget.data.map((item) => item.amount)}
                dates={widget.calculatedDates || widget.data.map((item) => item.date)}
                title={firstCapital(widget.title || widget.category)}
                unit={widget.unit}
                color={widget.color || "#546FDB"}
                fullWidget={true}
                showWarning={blockExpenditure}
                zeroMissingData={widget.zeroMissingData}
                showDecimals={(widget.category === "expenditure" || widget.category === "energy intake") ? 0 : 2}
                animationDuration={1000}
                fillDaily={fillDaily}
              />
            </View>
          )}
          
          

          {widget.layout === "calorie" && (
            <View>
              <View style={{marginTop: 20, flex: 1, }}>
                <GraphWidget
                  
                  data={widget.proteinData}
                  dates={widget.proteinDates}
                  title={"Protein"}
                  unit={"g"}
                  color={Colors.protein}
                  fullWidget={true}
                  showDecimals={2}
                  animationDuration={1000}
                  premiumLock={!user.premium}
                />
              </View>
              <View style={{marginTop: 20, flex: 1, }}>
                <GraphWidget
                  
                  data={widget.carbData}
                  dates={widget.carbDates}
                  title={"Carbs"}
                  unit={"g"}
                  color={Colors.carbs}
                  fullWidget={true}
                  showDecimals={2}
                  animationDuration={1000}
                  premiumLock={!user.premium}

                />
              </View>
              <View style={{marginTop: 20, flex: 1, }}>
                <GraphWidget
                  
                  data={widget.fatData}
                  dates={widget.fatDates}
                  title={"Fat"}
                  unit={"g"}
                  color={Colors.fat}
                  fullWidget={true}
                  showDecimals={2}
                  animationDuration={1000}
                  premiumLock={!user.premium}
                />
              </View>
            </View>
            
          )}

          {widget.layout === "bmi" && (
            <View>
              <ThemedText style={{fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: "center"}}>Breakdown of your current BMI</ThemedText>

              <View style={{width: "100%", backgroundColor: "#3a3a3a", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 20}}>
                <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%",}}>
                  {Array(5).fill(null).map((_, i) => {
                    const name = ["underweight", "normal", "overweight", "obese", "extremely obese"][i];
                    const label = ["< 18.5", "18.5 - 24.9", "25 - 29.9", "30 - 34.9", "> 35"][i];
                    const imageKey = name.split(" ")[0];
                    const image = BMI_IMAGES[imageKey];
                    return (
                      <View key={imageKey} style={{width: 1, height: 100, overflow: "visible"}}>
                          <View style={{alignItems: "center", width: 100, transform: [{translateX: '-50%'}]}}>
                            <ImageContain source={image} height={70} width={100} />
                            <Spacer height={5} />
                            <Text style={{color: "#A6A6A6", fontSize: 9, textAlign: "center"}}>{firstCapital(name)}</Text>
                            <Text style={{color: "white", fontSize: 9, textAlign: "center"}}>{label}</Text>
                          </View>
                      </View>
                      
                    )
                  })}
                </View>
                <Spacer height={10} />
                <View style={{width: "100%", height: 10, flexDirection: "row",}}>
                  <ImageContain source={BMI_IMAGES['gradient']} width={"100%"} height={10} style={{alignSelf: "center"}} />
                  {/* Marker */}
                  <View style={{height: 10, width: 10, borderRadius: 999, backgroundColor: "white", borderColor: "black", borderWidth: 2, position: "absolute", left: bmiMarkerLeftPercentage, top: "50%", transform: [{translateY: "-50%"}]}} />
                </View>
                
                <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%", position: "relative",}}>
                  {Array(5).fill(null).map((_, i) => {
                    const value = [17.5, 22.5, 27.5, 32.5, 37.5][i];
                    const percentage = ["10%", "30%", "50%", "70%", "90%"][i];
                    return (
                      <View key={value} style={{width: 1, overflow: "visible", position: "absolute", top: 0, left: percentage}}>
                          <View key={value} style={{alignItems: "center", width: 100, transform: [{translateX: '-50%'}]}}>
                            <Text style={{color: "white", fontSize: 10, textAlign: "center"}}>{value}</Text>
                          </View>
                      </View>
                      
                    )
                  })}
                </View>
                <Spacer height={10} />
              </View>
            </View>
            // <View>
            //   <ThemedText style={{fontSize: 13, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: "center"}}>Breakdown of your current BMI</ThemedText>

            //   <View style={{width: "100%", borderRadius: 10, overflow: "hidden"}}>
            //     <View style={{backgroundColor: bmiSectionIndex===0 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
            //       <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===0 ? '800' : '300' }}>Underweight</Text>
            //       <View style={{width: "40%", alignItems: "center"}}>
            //           <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===0 ? '800' : '300'}}>Below 18.5</Text>
            //       </View>
            //     </View>
            //     <View style={{backgroundColor: bmiSectionIndex===1 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
            //       <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===1 ? '800' : '300' }}>Healthy</Text>
            //       <View style={{width: "40%", alignItems: "center"}}>
            //           <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===1 ? '800' : '300'}}>18.5 - 24.9</Text>
            //       </View>
            //     </View>
            //     <View style={{backgroundColor: bmiSectionIndex===2 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
            //       <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===2 ? '800' : '300' }}>Overweight</Text>
            //       <View style={{width: "40%", alignItems: "center"}}>
            //           <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===2 ? '800' : '300'}}>25.0 – 29.9</Text>
            //       </View>
            //     </View>
            //     <View style={{backgroundColor: bmiSectionIndex===3 ? "#4E4E4E" : "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
            //       <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===3 ? '800' : '300' }}>Obesity</Text>
            //       <View style={{width: "40%", alignItems: "center"}}>
            //           <Text style={{color: "white", fontSize: 17, fontWeight: bmiSectionIndex===3 ? '800' : '300'}}>30.0 or above</Text>
            //       </View>
            //     </View>

            //   </View>
            // </View>
          )}

          {widget.layout === "expenditure" && (
            <ExpenditureBreakdown widget={widget} />
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
