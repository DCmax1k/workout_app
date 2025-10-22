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
import noEye from '../../../assets/icons/noEye.png'
import pencilIcon from '../../../assets/icons/pencil.png'
import whiteX from '../../../assets/icons/whiteX.png'
import { Colors } from '../../../constants/Colors'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { Portal } from 'react-native-paper'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ActionMenu from '../../../components/ActionMenu'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { ScrollView } from 'react-native-gesture-handler'
import calculateExpenditure, { useCalculateExpenditure } from '../../../util/calculateExpenditure'
import memoizeOne from 'memoize-one'
import NutritionWidget from '../../../components/nutrition/NutritionWidget'
import calculateBMI from '../../../util/calculateBMI'


const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [addWidget, setAddWidget] = useState(false);


  const openProgressExpanded = (category, categoryData) => {
    const data = {
      category,
      ...categoryData
    }

    router.push({
      pathname: "/progressExpanded",
      params: {
        data: JSON.stringify(data),
      },
    });
  } 
  const openNutrition = () => {
    router.push({
      pathname: "/nutrition",
    });
  }

  const widgets = ["nutrition", "weight", "sleep amount", "sleep quality", "water intake"];
  const widgetsAvailable = widgets.filter(w => !user.tracking.visibleWidgets.includes(w));
  const selectAddWidget = (wid) => {
    const visibleWidgets = user.tracking.visibleWidgets;
    if (visibleWidgets.includes(wid)) return setAddWidget(false);

    const updated = [...visibleWidgets, wid]; // clone, don’t mutate
    
    updateUser({ tracking: { visibleWidgets: updated } });
    setAddWidget(false);
  };
    

  const setVisibleWidgetsFlatlistData = (data) => {
    const newVisibleWidgets = data.map(d => d.key);
    updateUser({tracking: {visibleWidgets: newVisibleWidgets}});
  }

  const updatedVisibleWidgets = user.tracking.visibleWidgets;
  if (!updatedVisibleWidgets.includes("nutrition")) updatedVisibleWidgets.unshift("nutrition");
  const visibleWidgetsFlatlistData = updatedVisibleWidgets.map((key, i) => {

          if (key === "nutrition") {
            return {
              key,
              height: (screenWidth-60)/2,
              width: screenWidth - 40,
            }
          }
          const widget = user.tracking.logging[key];
          return {
            key,
            height: 205 + 20, // 20 margin bottom
            width: screenWidth - 40,
            widget,
          }
        })

  const widgetActionMenuData = [

                ];



  const expenditureData = calculateExpenditure(user);
  const bmiData = calculateBMI([], [], user); // Two blank arrays, all data is dynamic

  return (

    <ThemedView style={styles.container}>
        
        <SafeAreaView style={{flex: 1}}>

        {addWidget && (
            <Portal >
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", width: screenWidth, height: screenHeight, zIndex: 2}} >
                <Pressable onPress={() => setAddWidget(false)} style={{height: "100%", width: "100%", zIndex: 0}}></Pressable>
                  <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={{position: "absolute", width: screenWidth-20, top: 50, left: 10, zIndex: 2}}>
                    
                    <Animated.View layout={LinearTransition.springify().damping(90)} style={[styles.addWidgetCont]}>

                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start", }}>
                        <Pressable onPress={() => setAddWidget(false)}>
                            <Image source={whiteX} style={{ height: 30, width: 30, marginRight: 20}} />
                        </Pressable>
                        
                        <Text adjustsFontSizeToFit style={[styles.screenText, { flex: 1, }]}>Add widget</Text>

                        <View style={{width: 80}}></View>
                      </View>

                      <Spacer height={20} />

                      <View style={{width: "100%", borderRadius: 10, overflow: "hidden"}}>
                        {widgetsAvailable.map((wid, i) => (
                          <Pressable key={i} onPress={() => selectAddWidget(wid)} style={{backgroundColor:  "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
                            <Text style={{color: "white", fontSize: 17, fontWeight:'800'  }}>{firstCapital(wid)}</Text>
                            
                          </Pressable>
                        ))}

                      </View>
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
                  <Pressable onPress={() => setAddWidget(true)} style={{flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: Colors.primaryBlue, borderRadius: 50, height: 30, paddingHorizontal: 10}} >
                    <View style={{height: 20, width: 20, justifyContent: "center", alignItems: "center", marginRight: 10}}>
                      <Image style={{height: 20, width: 20, objectFit: 'contain'}} source={plusIcon} />
                    </View>
                    <Text style={{fontSize: 15, color: "white", fontWeight: 600}}>Add widget</Text>
                  </Pressable>
                  {/* <ActionMenu data={widgetActionMenuData} /> */}
                </View>

                <Spacer height={20} />
                </>
              }
              contentContainerStyle={{paddingBottom: 220}}
              showsVerticalScrollIndicator={false}
              // nestedScrollEnabled={true}
              data={visibleWidgetsFlatlistData}
              onDragEnd={({data}) => setVisibleWidgetsFlatlistData(data)}
              keyExtractor={(item) => item.key}
              renderItem={({item, drag, isActive}) => {

                if (item.key === "nutrition") return (
                  <ScaleDecorator key={item.key}>
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

                
                if (key === 'water intake') {
                    // If last item of data is not from today, add a 0 value for today
                    const today = new Date();
                    const lastDate = dates[dates.length -1] ? new Date(dates[dates.length -1]) : null;
                    if (!lastDate || lastDate.toDateString() !== today.toDateString()) {
                      widget.calculatedData = [...data, 0];
                      widget.calculatedDates = [...dates, today.toISOString()];
                    }
                  }
                

                return (
                  <ScaleDecorator key={item.key}>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => openProgressExpanded(item.key, item.widget)}
                      style={{width: item.width, marginHorizontal: 20}}
                    >
                    <GraphWidget
                      fillWidth={true}
                      data={widget.calculatedData}
                      dates={widget.calculatedDates}
                      title={firstCapital(item.key)}
                      unit={widget.unit}
                      color={widget.color || "#546FDB"}
                      style={{marginBottom: 20}}
                      disablePress={true}
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
                        const calWalkingSteps = false; // True if: weight, and access to step count
                        const calFood = true; // True when finished developing meals
                        const blockExpenditure = key === "expenditure" && ( !calResting || !calExercising || !calWalkingSteps || !calFood);
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