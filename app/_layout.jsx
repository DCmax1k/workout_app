import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {Colors} from '../constants/Colors'
import { useUserStore } from '../stores/useUserStore'
import keyboardIcon from '../assets/icons/keyboard.png'
import { PaperProvider, Portal } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FadeIn } from 'react-native-reanimated'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme()
  //console.log(colorScheme);
  const theme = Colors[colorScheme];

  const {animateDashboard} = useUserStore((state) => state.options);

  const [keyboardVisible, setKeyboardVisible] = useState(false);


  const [loaded, error] = useFonts({
    'Bals-Bold': require('../assets/fonts/BalsamiqSans-Bold.ttf'),
    'Bals-Regular': require('../assets/fonts/BalsamiqSans-Regular.ttf'),
    'Exo2-Thin': require('../assets/fonts/Exo2-Thin.ttf'),
    'Exo2-ExtraLight': require('../assets/fonts/Exo2-ExtraLight.ttf'),
    'DoppioOne-Regular': require('../assets/fonts/DoppioOne-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  

  const isIos = Platform.OS === 'ios';
  
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}> */}
      <PaperProvider>
        <StatusBar style="light" />
        <GestureHandlerRootView>
        
          <SafeAreaProvider>
            <Stack screenOptions={{contentStyle: {backgroundColor: theme.background,}}}>
              <Stack.Screen name='index' options={{ headerShown: false }} />
              <Stack.Screen name="dashboard" options={{ headerShown: false, animation: animateDashboard ? "default" : "fade" }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "slide_from_left" }} />
              <Stack.Screen name="editworkout" options={{ headerShown: false }} />
              <Stack.Screen name="loading" options={{ headerShown: true, animation: "slide_from_bottom" }} />
              {/* <Stack.Screen name="login" options={{ headerShown: false, animation: "fade" }} /> */}
              <Stack.Screen name="previewWorkout" options={{ headerShown: false }} />

              <Stack.Screen name="GlowImageCont" options={{ headerShown: false, animation: "fade" }} />
            </Stack>

            <KeyboardAvoidingView style={{position: "absolute", bottom: -10, right: 20, paddingBottom: 10, zIndex: 100, marginBottom: isIos ? -50 : 0,}} behavior={isIos ? 'position' : 'height'}>
                <Pressable style={[styles.disKeyboard, { display: isIos ? "flex" : keyboardVisible ? "flex" : "none"}]} onPress={() =>
                  {
                    Keyboard.dismiss();
                    //setKeyboardVisible(false);
                    }} >
                  <Image style={{height: 30, width: 30, objectFit: 'contain'}} source={keyboardIcon} />
                </Pressable>
            </KeyboardAvoidingView>

            
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