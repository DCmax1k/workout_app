import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'
import {Colors} from '../../constants/Colors'
import TabBar from '../../components/TabBar'

const Dashboard = () => {

  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme];

  return (
      <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{headerShown: false, headerStyle: { backgroundColor: theme.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0,}, headerTintColor: theme.title, tabBarStyle: { backgroundColor: "#000" }, tabBarActiveTintColor: theme.title, tabBarInactiveTintColor: "#868686", }}> 
        <Tabs.Screen name="home" options={{ title: 'Home', headerTintColor: "transparent"  }} />
        <Tabs.Screen name="workout" options={{ title: 'Workouts' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      </Tabs>
  )
}

export default Dashboard

const styles = StyleSheet.create({})