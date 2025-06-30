import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'

const FriendsIndex = () => {
  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}} >
            <TitleWithBack title={"Friends"} backBtn={false}/>
        </SafeAreaView>
    </ThemedView>
  )
}

export default FriendsIndex

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
    },
    
  })