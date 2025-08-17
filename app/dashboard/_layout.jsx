import { Dimensions, Modal, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Redirect, router, Tabs } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {Colors} from '../../constants/Colors'
import TabBar from '../../components/TabBar'
import { useUserStore } from '../../stores/useUserStore'
import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetContext } from '../../context/BottomSheetContext'
import ActiveWorkout from '../../components/workout/ActiveWorkout'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import FinishWorkout from '../../components/workout/FinishWorkout'
import { PaperProvider, Provider } from 'react-native-paper'

const screenHeight = Dimensions.get("screen").height;

const Dashboard = () => {
  const user = useUserStore((state) => state.user);
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme];

  const finishWorkoutPositionTop = useSharedValue(screenHeight);
  const finishWorkoutStyle = useAnimatedStyle(() => {
    return {
      top: finishWorkoutPositionTop.value,
    }
  }, [])

  const sheetRef = useRef(null);

  const [sheetShouldStartOpen, setSheetShouldStartOpen] = useState(false);
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setSheetShouldStartOpen(user.activeWorkout !== null);
      }, 1000)
    }
    
    
  }, [user]);

  const [sheetOpen, setSheetOpen] = useState(sheetShouldStartOpen);

  const [finishWorkoutData, setFinishWorkoutData] = useState(null);

  const tabBarHeight = 115;
  const activePreview = 85;
  const firstSnap = tabBarHeight+activePreview;
  const snapPoints = [firstSnap, 0.95*screenHeight];

  const animatedPosition = useSharedValue(0);
  const [currentPosition, setCurrentPosition] = React.useState(0);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
    setSheetOpen(true);
  }, []);
  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
    setSheetOpen(false);
  }, []);
  

  const animatedFinishOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap-30, screenHeight-0.95 * screenHeight],
      [0, 1], Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedHeaderOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap, screenHeight-0.95 * screenHeight],
      [1, 0],
      Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedTabbarPosition = useAnimatedStyle(() => {
    const bottom = interpolate(
      animatedPosition.value,
      [screenHeight-firstSnap-30, screenHeight-0.95 * screenHeight],
      [0, -tabBarHeight],
      Extrapolation.CLAMP);
    return {bottom};
  })

  const showFinishWorkout = (data) => {
    setFinishWorkoutData(data);
    // Animate
    finishWorkoutPositionTop.value = withTiming(0, {duration: 300});
  }

  const closeFinishWorkout = () => {
    const animateTime = 300;
    finishWorkoutPositionTop.value = withTiming(screenHeight, {duration: animateTime});
    setTimeout(() => {setFinishWorkoutData(null);}, animateTime);
  }


  return user ? (
    <BottomSheetContext.Provider value={{ openSheet: handleSnapPress, closeSheet: handleCloseSheet, showFinishWorkout }}>
        <>
          <Tabs tabBar={props => <TabBar animatedTabbarPosition={animatedTabbarPosition} {...props} />} screenOptions={{animation: 'fade', headerShown: false, headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,}, headerTintColor: theme.title, tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: theme.title, tabBarInactiveTintColor: "#868686", }}> 
              <Tabs.Screen name="home" options={{ title: 'Home', headerTintColor: "transparent"  }} />
              <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
              <Tabs.Screen name="workout" options={{ title: 'Workout' }} />
              <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
              <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
            </Tabs>

            <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onClose={() => setSheetOpen(false)}
            backgroundStyle={{backgroundColor: "#313131"}}
            handleIndicatorStyle={{backgroundColor: "white", width: 80}}
            animatedPosition={animatedPosition}
            index={sheetShouldStartOpen ? 0 : -1}
            onChange={index => setCurrentPosition(index)}

            >
                {user.activeWorkout && (
                  <ActiveWorkout
                  animatedFinishOpacity={animatedFinishOpacity}
                  animatedHeaderOpacity={animatedHeaderOpacity}
                  currentPosition={currentPosition}
                />
                )}
                

            </BottomSheet>

            

            <Animated.View style={[{position: "absolute", /* top: (finishWorkoutData !== null ? true : false) ? 0 : screenHeight, */ left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}, finishWorkoutStyle]}>
                      {finishWorkoutData !== null ? (
                      <FinishWorkout data={finishWorkoutData} closeModal={closeFinishWorkout} />
                      ) : null}
                  </Animated.View>

          </>
      
        

      </BottomSheetContext.Provider>
  ) : (
    <Redirect href="/login" />
  )
}

export default Dashboard

const styles = StyleSheet.create({})