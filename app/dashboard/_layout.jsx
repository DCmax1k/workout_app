import { Dimensions, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Redirect, Tabs } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {Colors} from '../../constants/Colors'
import TabBar from '../../components/TabBar'
import { useUserStore } from '../../stores/useUserStore'
import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetContext } from '../../context/BottomSheetContext'
import ActiveWorkout from '../../components/workout/ActiveWorkout'
import { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'

const screenHeight = Dimensions.get("window").height;

const Dashboard = () => {
  const user = useUserStore((state) => state.user);
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme];

  const sheetRef = useRef(null);
  const [sheetOpen, setSheetOpen] = useState(true);

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
    const opacity = interpolate( animatedPosition.value, [screenHeight-firstSnap, screenHeight-0.95 * screenHeight], [0, 1], Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedHeaderOpacity = useAnimatedStyle(() => {
    const opacity = interpolate( animatedPosition.value, [screenHeight-firstSnap, screenHeight-0.95 * screenHeight], [1, 0], Extrapolation.CLAMP );
    return {opacity};
  });

  const animatedTabbarPosition = useAnimatedStyle(() => {
    const bottom = interpolate(animatedPosition.value, [screenHeight-firstSnap, screenHeight-0.95 * screenHeight], [0, -tabBarHeight], Extrapolation.CLAMP);
    return {bottom};
  })

  return user ? (
    <BottomSheetContext.Provider value={{ openSheet: handleSnapPress, closeSheet: handleCloseSheet }}>

      <>
        <Tabs tabBar={props => <TabBar animatedTabbarPosition={animatedTabbarPosition} sheetOpen={sheetOpen} {...props} />} screenOptions={{headerShown: false, headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,}, headerTintColor: theme.title, tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: theme.title, tabBarInactiveTintColor: "#868686", }}> 
            <Tabs.Screen name="home" options={{ title: 'Home', headerTintColor: "transparent"  }} />
            <Tabs.Screen name="workout" options={{ title: 'Workouts' }} />
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
          index={-1}
          onChange={index => setCurrentPosition(index)}

          >
              {user.activeWorkout && (
                <ActiveWorkout
                sheetOpen={sheetOpen}
                animatedFinishOpacity={animatedFinishOpacity}
                animatedHeaderOpacity={animatedHeaderOpacity}
              />
              )}
              

          </BottomSheet>

        </>

      </BottomSheetContext.Provider>
  ) : (
    <Redirect href="/login" />
  )
}

export default Dashboard

const styles = StyleSheet.create({})