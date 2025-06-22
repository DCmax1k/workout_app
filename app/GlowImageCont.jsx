import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import { useLocalSearchParams } from 'expo-router'

const GlowImageCont = () => {

    const { source, tag } = useLocalSearchParams()
    console.log("Arrived with tag", tag, "and source", source);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
      {source && (
        <View style={{flex: 1, position: 'relative', justifyContent: "center", alignItems: "center"}}>
            <Animated.Image
                sharedTransitionTag={tag}
                source={source}
                style={{ width: 200, height: 200 }}
                />
        </View>
        
      )}
    </View>
  )
}

export default GlowImageCont

const styles = StyleSheet.create({})