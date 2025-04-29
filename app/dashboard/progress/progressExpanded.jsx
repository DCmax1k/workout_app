import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import LineGraph from '../../../components/LineGraph'
import { useUserStore } from '../../../stores/useUserStore'

const progressExpanded = () => {
  const user = useUserStore((state) => state.user);
  const data = user.analytics.weight.map((item) => item.amount);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText>Expanded Progress</ThemedText>
        
      </SafeAreaView>
    </ThemedView>
  )
}

export default progressExpanded

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  
})