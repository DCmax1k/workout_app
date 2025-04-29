import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'

const Workout = () => {
  return (
    <ThemedView  style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={{fontSize: 20, fontWeight: 700, marginTop: 20}}>Workout</ThemedText>
      </SafeAreaView>
    </ThemedView>
  )
}

export default Workout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  
})