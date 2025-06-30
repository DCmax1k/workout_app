import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import { useLocalSearchParams } from 'expo-router'
import TitleWithBack from '../components/TitleWithBack'
import Spacer from '../components/Spacer'

const GlowImageCont = () => {

    const { data } = useLocalSearchParams()
    const parsedData = JSON.parse(data);
    const {tag, source} = parsedData;
    console.log("Arrived with tag", tag, "and source", source);

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>

        <Spacer height={60} />
        <Animated.View style={{flex: 1, alignItems: "center", }} >
          <TitleWithBack backBtn={true} title={"Go back"} />
            <Animated.Image
                sharedTransitionTag={tag}
                source={source}
                style={{ width: 200, height: 200 }}
                />
        </Animated.View>

        
        
    </View>
  )
}

export default GlowImageCont

const styles = StyleSheet.create({})