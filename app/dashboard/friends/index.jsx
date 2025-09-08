import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../../components/ThemedView'
import ThemedText from '../../../components/ThemedText'
import TitleWithBack from '../../../components/TitleWithBack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../../../components/Search'

const FriendsIndex = () => {
  return (
    <ThemedView style={styles.container}>
        <SafeAreaView style={{flex: 1}} >
          <View style={{flex: 1, padding: 20}}>
            <Search />
          </View>
            
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