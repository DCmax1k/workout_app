import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import {Colors} from '../constants/Colors'

const RootLayout = () => {
  const colorScheme = useColorScheme()
  console.log(colorScheme);
  const theme = Colors[colorScheme];
  
  return (
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})