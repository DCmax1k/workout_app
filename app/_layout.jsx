import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import {Colors} from '../constants/Colors'
import { useUserStore } from '../stores/useUserStore'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  console.log(colorScheme);
  const theme = Colors[colorScheme];
  
  return (
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="editworkout" options={{ headerShown: false }} />
        <Stack.Screen name="loading" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
      </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})