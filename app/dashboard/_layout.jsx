import { Dimensions, Modal, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Redirect, router, Stack, Tabs } from 'expo-router'
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
import StackTabBar from '../../components/StackTabBar'

const screenHeight = Dimensions.get("screen").height;

const Dashboard = () => {
  const user = useUserStore((state) => state.user);
  const updateOptions = useUserStore((state) => state.updateOptions);
  const {animateDashboard} = useUserStore((state) => state.options);
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme];

  const testingWorkout = {name: "Legs", id: "234", exercises: [ {id: "2", note:"", tracks: [], sets: [{lbs: "135", reps: "10"}]},], fullWorkout: {name: "Legs", id: "234", exercises: [ {id: "2", note:"", tracks: [], sets: [{lbs: "135", reps: "10"}]},], } };
  const [finishWorkoutData, setFinishWorkoutData] = useState(null);

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
      }, 100)
    }
    
    
  }, []);


    useEffect(() => {
      if (animateDashboard) {
        // do your animation here
        // then reset so future visits are default
        setTimeout(() => {
            updateOptions({ animateDashboard: false });
        }, 1000)
      }

      //showFinishWorkout(testingWorkout);
    }, [animateDashboard]);

  

  const tabBarHeight = 115;
  const activePreview = 85;
  const firstSnap = tabBarHeight+activePreview;
  const snapPoints = [firstSnap, 0.95*screenHeight];

  const animatedPosition = useSharedValue(0);
  const [currentPosition, setCurrentPosition] = React.useState(0);

  const [currentRoute, setCurrentRoute] = useState(0); // route index 

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
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
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <BottomSheetContext.Provider value={{ openSheet: handleSnapPress, closeSheet: handleCloseSheet, showFinishWorkout, setTabBarRoute: setCurrentRoute }}>
        <>
          {/* <Tabs tabBar={props => <TabBar animatedTabbarPosition={animatedTabbarPosition} {...props} />} screenOptions={{animation: "none", headerShown: false, headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,}, headerTintColor: theme.title, tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: theme.title, tabBarInactiveTintColor: "#868686", }}> 
              <Tabs.Screen name="home" options={{ title: 'Home', headerTintColor: "transparent"  }} />
              <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
              <Tabs.Screen name="workout" options={{ title: 'Workouts', popToTopOnBlur: true }} />
              <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
              <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
            </Tabs> */}
            <Stack screenOptions={{animation: "fade", animationDuration: 200, headerShown: false, contentStyle: {backgroundColor: theme.background,}}}>
              <Stack.Screen name="home" options={{ title: 'Home', }} />
              <Stack.Screen name="friends" options={{ title: 'Friends' }} />
              <Stack.Screen name="workout" options={{ title: 'Workouts', }} />
              <Stack.Screen name="exercises" options={{ title: 'Exercises' }} />
              <Stack.Screen name="progress" options={{ title: 'Progress' }} />
            </Stack>

            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              enableDynamicSizing={false}
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

            {/* Stack TabBar */}
            <StackTabBar animatedTabbarPosition={animatedTabbarPosition} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />

            

            <Animated.View style={[{position: "absolute", /* top: (finishWorkoutData !== null ? true : false) ? 0 : screenHeight, */ left: 0, height: screenHeight, width: "100%", zIndex: 5, elevation: 5}, finishWorkoutStyle]}>
                      {finishWorkoutData !== null && (
                      <FinishWorkout data={finishWorkoutData} closeModal={closeFinishWorkout} />
                      )}
                  </Animated.View>

          </>
      
        

      </BottomSheetContext.Provider>
    </View>
    
  ) : (
    <Redirect href="/onboarding" />
  )
}

export default Dashboard

const styles = StyleSheet.create({})