import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {Colors} from '../constants/Colors'
import { useUserStore } from '../stores/useUserStore'
import keyboardIcon from '../assets/icons/keyboard.png'
import { PaperProvider, Portal } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  //console.log(colorScheme);
  const theme = Colors[colorScheme];

  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const isIos = Platform.OS === 'ios';
  
  return (
    <GestureHandlerRootView>
    <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="editworkout" options={{ headerShown: false }} />
        <Stack.Screen name="loading" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
        <Stack.Screen name="workouthistory" options={{ headerShown: false }} />
      </Stack>
    

        <KeyboardAvoidingView style={{position: "absolute", bottom: 0, right: 20, paddingBottom: 10, marginBottom: isIos ? -50 : 0,}} behavior={isIos ? 'position' : 'height'}>
          <Pressable style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: "#828282", borderRadius: 10, display: isIos ? "block" : keyboardVisible ? "block" : "none"}} onPress={() => {Keyboard.dismiss(); setKeyboardVisible(false)}} >
            <Image style={{height: 30, width: 30, objectFit: 'contain'}} source={keyboardIcon} />
          </Pressable>
        </KeyboardAvoidingView>


      
    </GestureHandlerRootView>
      
  )
}

export default RootLayout

const styles = StyleSheet.create({})