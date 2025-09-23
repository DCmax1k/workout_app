import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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

const firstCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IndexProgress = () => {
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [confirmMenuActive, setConfirmMenuActive] = useState(false);
  const [confirmMenuData, setConfirmMenuData] = useState();

  const [addWidget, setAddWidget] = useState(false);


  const showComingSoonMessage = () => {
      setConfirmMenuData({
          title: "Coming soon!",
          subTitle: "This feature is not yet available but will be coming in a future update.",
          subTitle2: "",
          option1: "Awesome!",
          option1color: "#546FDB",
          confirm: () => setConfirmMenuActive(false),
      });
      setConfirmMenuActive(true);
  }


  

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
  const widgets = ["weight", "sleep amount", "sleep quality", "water intake"];
  const widgetsAvailable = widgets.filter(w => !user.tracking.visibleWidgets.includes(w));
  const selectAddWidget = (wid) => {
    const visibleWidgets = user.tracking.visibleWidgets;
    const ind = visibleWidgets.indexOf(wid)
    if (ind >= 0) return setAddWidget(false);
    
    visibleWidgets.push(wid)

    updateUser({tracking: { visibleWidgets: visibleWidgets}});
    setAddWidget(false);
  }
    

  const setVisibleWidgetsFlatlistData = (data) => {
    const newVisibleWidgets = data.map(d => d.key);
    updateUser({tracking: {visibleWidgets: newVisibleWidgets}});
  }
  const visibleWidgetsFlatlistData = user.tracking.visibleWidgets.map((key, i) => {
          if (key === "nutrition") return null;
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


  return (

    <ThemedView style={styles.container}>
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
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
              nestedScrollEnabled={true}
              data={visibleWidgetsFlatlistData}
              onDragEnd={({data}) => setVisibleWidgetsFlatlistData(data)}
              keyExtractor={(item) => item.key}
              renderItem={({item, drag, isActive}) => {
                return (
                  <ScaleDecorator>
                    <TouchableOpacity
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => openProgressExpanded(item.key, item.widget)}
                      style={{width: item.width, marginHorizontal: 20}}
                    >
                    <GraphWidget
                      fillWidth={true}
                      data={item.widget.data.map((it) => it.amount)}
                      dates={item.widget.data.map((it) => it.date)}
                      title={firstCapital(item.key)}
                      unit={item.widget.unit}
                      color={item.widget.color || "#546FDB"}
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
                        const calFood = false; // True when finished developing meals
                        const blockExpenditure = key === "expenditure" && ( !calResting || !calExercising || !calWalkingSteps || !calFood);
                        widget.calResting = calResting;
                        widget.calExercising = calExercising;
                        widget.calWalkingSteps = calWalkingSteps;
                        widget.calFood = calFood;
                        widget.blockExpenditure = blockExpenditure;
                        widget.zeroMissingData = key === "expenditure";
                        

                        return  (
                          <View key={key} >
                            <GraphWidget
                              key={index}
                              data={widget.data.map((item) => item.amount)}
                              dates={widget.data.map((item) => item.date)}
                              title={firstCapital(key)}
                              unit={widget.unit}
                              color={widget.color || "#546FDB"}
                              onPress={() => openProgressExpanded(key, widget)}
                              showWarning={widget.blockExpenditure}
                              zeroMissingData={widget.zeroMissingData}
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