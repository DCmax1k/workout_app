import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {Colors} from '../constants/Colors'
import { useUserStore } from '../stores/useUserStore'
import keyboardIcon from '../assets/icons/keyboard.png'
import { PaperProvider, Portal } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync();

const screenHeight = Dimensions.get('screen').height;

const RootLayout = () => {
  const colorScheme = useColorScheme()
  //console.log(colorScheme);
  const theme = Colors[colorScheme];

  const {animateDashboard} = useUserStore((state) => state.options);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);


  const [loaded, error] = useFonts({
    'Bals-Bold': require('../assets/fonts/BalsamiqSans-Bold.ttf'),
    'Bals-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
    'Exo2-Thin': require('../assets/fonts/Exo2-Thin.ttf'),
    'Exo2-ExtraLight': require('../assets/fonts/Exo2-ExtraLight.ttf'),
    'DoppioOne-Regular': require('../assets/fonts/DoppioOne-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
  //     setKeyboardVisible(true);
  //   });
  //   const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
  //     setKeyboardVisible(false);
  //   });

  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);
  useEffect(() => {
    const onKeyboardShow = (e) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height)
    };
    const onKeyboardHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };
    const onKeyboardChange = (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    const willShowSub = Keyboard.addListener("keyboardWillShow", onKeyboardShow);
    const didShowSub = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    const willHideSub = Keyboard.addListener("keyboardWillHide", onKeyboardHide);
    const didHideSub = Keyboard.addListener("keyboardDidHide", onKeyboardHide);
    const changeSub = Keyboard.addListener('keyboardDidChangeFrame', onKeyboardChange);

    return () => {
      willShowSub.remove();
      didShowSub.remove();
      willHideSub.remove();
      didHideSub.remove();
      changeSub.remove();
    };
  }, []);

  if (!loaded) {
    return <View></View>;
  }

  if (error) {
    console.error('Font loading error:', error);
    return <View><Text>Font load failed</Text></View>;
  }

  

  const isIos = Platform.OS === 'ios';
  
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}> */}
      <PaperProvider>
        <StatusBar style="light" />
        <GestureHandlerRootView>
          <SafeAreaProvider>

            <View style={{flex: 1}}>
              <Portal.Host style={{height: screenHeight}}>
                <Stack screenOptions={{contentStyle: {backgroundColor: theme.background,}}}>
                  <Stack.Screen name='index' options={{ headerShown: false }} />
                  <Stack.Screen name="dashboard" options={{ headerShown: false, animation: animateDashboard ? "default" : "fade" }} />
                  <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "slide_from_left" }} />
                  <Stack.Screen name="editworkout" options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="loading" options={{ headerShown: true, animation: "slide_from_bottom" }} />
                  {/* <Stack.Screen name="login" options={{ headerShown: false, animation: "fade" }} /> */}
                  <Stack.Screen name="previewWorkout" options={{ headerShown: false }} />
                  <Stack.Screen name="(progressScreens)/progressExpanded" options={{ headerShown: false }} />
                  <Stack.Screen name="(progressScreens)/inputValueScreen" options={{ headerShown: false }} />
                  <Stack.Screen name="(progressScreens)/editPastData" options={{ headerShown: false }} />

                  <Stack.Screen name="GlowImageCont" options={{ headerShown: false, animation: "fade" }} />
                </Stack>
              </Portal.Host>
            </View>

            {/* Dismiss Keyboard button */}
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <Portal.Host >
                <Portal style={{zIndex: 99999}}>

                  {/* Using absolute position and animated transition */}
                  {keyboardVisible && (
                    <Animated.View
                      entering={SlideInDown.springify().damping(15)}
                      exiting={SlideOutDown.springify().damping(15)}
                      style={{
                        position: "absolute",
                        right: 20,
                        bottom: keyboardHeight + (Platform.OS === "ios" ? 10 : 30),
                        zIndex: 99999999,
                      }}
                    >
                      <Pressable style={styles.disKeyboard} onPress={() => Keyboard.dismiss()}>
                        <Image
                          style={{ height: 30, width: 30, resizeMode: "contain" }}
                          source={keyboardIcon}
                        />
                      </Pressable>
                    </Animated.View>
                  )}

                </Portal>
              </Portal.Host>
            </View >
              
            

            
          </SafeAreaProvider>
        

          
        </GestureHandlerRootView>
      </PaperProvider>
      {/* </Pressable> */}
    </View>
    
      
  )
}

export default RootLayout

const styles = StyleSheet.create({
  disKeyboard:{
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.primaryOrange,
    borderRadius: 10,
    borderColor: Colors.dark.background,
    borderWidth: 2,
  }
})