import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'

const ExercisesIndex = () => {
  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}} >
            <TitleWithBack title={"Exercises"} backBtn={false}/>
        </SafeAreaView>
    </ThemedView>
  )
}

export default ExercisesIndex

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    
  })