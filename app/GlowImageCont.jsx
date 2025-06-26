import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import { useLocalSearchParams } from 'expo-router'

const GlowImageCont = () => {

    const { source, tag } = useLocalSearchParams()
    console.log("Arrived with tag", tag, "and source", source);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Animated.View style={{flex: 1, position: 'relative', justifyContent: "center", alignItems: "center"}} sharedTransitionTag={tag}>
            <Animated.Image
                
                source={source}
                style={{ width: 200, height: 200 }}
                />
        </Animated.View>
        
    </View>
  )
}

export default GlowImageCont

const styles = StyleSheet.create({})