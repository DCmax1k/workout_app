import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import BlueButton from '../../../components/BlueButton'
import { router } from 'expo-router'
import { useUserStore } from '../../../stores/useUserStore'
import { SafeAreaView } from 'react-native-safe-area-context'
import GraphWidget from '../../../components/GraphWidget'
import Spacer from '../../../components/Spacer'
import plusIcon from '../../../assets/icons/plus.png'
import whiteX from '../../../assets/icons/whiteX.png'
import { Colors } from '../../../constants/Colors'
import ConfirmMenu from '../../../components/ConfirmMenu'
import { Portal } from 'react-native-paper'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition } from 'react-native-reanimated'

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

  const showComingSoonMessage = (data) => {
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
    // Open progress expanded view
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

  const widgetsAvailable = ["weight", "sleep amount", "sleep quality", "water intake"];
  const selectAddWidget = (indx) => {
    const visibleWidgets = user.tracking.visibleWidgets;
    const ind = visibleWidgets.indexOf(widgetsAvailable[indx])
    if (ind >= 0) return setAddWidget(false);
    
    visibleWidgets.push(widgetsAvailable[indx])

    updateUser({tracking: { visibleWidgets: visibleWidgets}});
    setAddWidget(false);
  }


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
                          <Pressable key={i} onPress={() => selectAddWidget(i)} style={{backgroundColor:  "#3A3A3A", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, padding: 10}}>
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

          <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>

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
            </View>

            <Spacer height={20} />

            {/* LOGGING and TRACKING */}
            <Animated.View style={{paddingHorizontal: 20}} layout={LinearTransition.springify().mass(0.5).damping(10)}>
              {user.tracking.visibleWidgets.length === 0 ? (<ThemedText style={{textAlign: "center"}}>No widgets yet</ThemedText>) : null}
              {user.tracking.visibleWidgets.map((key, index) => {
                const widget = user.tracking.logging[key];
                return (
                  <Animated.View key={key} layout={LinearTransition.springify().damping(90)} entering={FadeIn} exiting={FadeOut}>
                  <GraphWidget
                    fillWidth={true}
                    key={index}
                    data={widget.data.map((item) => item.amount)}
                    dates={widget.data.map((item) => item.date)}
                    title={firstCapital(key)}
                    unit={widget.unit}
                    color={widget.color || "#546FDB"}
                    style={{marginBottom: 20}}
                    onPress={() => openProgressExpanded(key, widget)}
                  />
                  </Animated.View>
                );
              })}
            </Animated.View>

            <Spacer />

            <Animated.View layout={LinearTransition.springify().damping(90)}>
              <ThemedText style={[styles.header, { fontSize: 15}]} >Insights</ThemedText>

              {/* INSIGHTS */}
              <ScrollView style={styles.widgets} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: "flex-start", paddingHorizontal: 20}} >
                {Object.keys(user.tracking.insights).map((key, index) => {
                  const widget = user.tracking.insights[key];
                  return widget.active ? (
                    <View key={key} >
                      <GraphWidget
                        key={index}
                        data={widget.data.map((item) => item.amount)}
                        dates={widget.data.map((item) => item.date)}
                        title={firstCapital(key)}
                        unit={widget.unit}
                        color={widget.color || "#546FDB"}
                        onPress={() => openProgressExpanded(key, widget)}
                        
                      />
                    </View>
                    
                  ) : null
                })}
              </ScrollView>
            </Animated.View>

            
              


            

          </ScrollView>
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