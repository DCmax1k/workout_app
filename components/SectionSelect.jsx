import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Animated, { Easing, Extrapolation, interpolate, ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const screenWidth = Dimensions.get("window").width;



const SectionSelect = ({style, sections, section, setSection, paddingHorizontal = 40, barWidth = null, height=50, backgroundColor="#222222", textColor="white", fontSize=17, fontWeight=600, sliderColor="#5B5B5B", ...props}) => {
 
    barWidth = barWidth ? barWidth : screenWidth-paddingHorizontal;

    const index = sections.indexOf(section);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const sectionWidth = (layoutWidth/sections.length);

    const setSectionTo = (sec) => {
        setSection(sec);
        // Animate
        const ind = sections.indexOf(sec);
        animatedIndex.value =   withTiming(ind, {
            duration: 300,
            easing: Easing.bezier(0.36, 0.35, 0, 1.02),
            reduceMotion: ReduceMotion.System,
        })
    }

    // Animations
    const animatedIndex = useSharedValue(index);
    const animatedLeftStyle = useAnimatedStyle(() => {
        const left = interpolate(
          animatedIndex.value,
          [0, sections.length-1],
          [0, sectionWidth*(sections.length-1)],);
        return {left};
      })


  return (

    <View style={[styles.cont, style, {width: barWidth, height, backgroundColor,}]} onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}>

                <Animated.View style={[styles.sliderCont, { width: sectionWidth, }, animatedLeftStyle]}>
                   <View style={[styles.slider, {backgroundColor: sliderColor}]}>

                    </View> 
                </Animated.View>
                

            {sections.map((section, i) => {
                return (
                    <Pressable onPress={() => setSectionTo(section)} style={[styles.section, {width: sectionWidth}]} key={i}>
                            <Text style={[styles.sectionText, {color: textColor, fontSize, fontWeight,}]}>{section}</Text>
                    </Pressable>
                    
                )
            })}
    </View>
    
  )
}

export default SectionSelect

const styles = StyleSheet.create({
    cont: {
        borderRadius: 10,
        padding: 0,
         //
        flexDirection: "row",
        position: "relative",
    },
    section: {
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionText: {
         //
         //
         //
        textAlign: "center",
    },
    sliderCont: {
        height: "100%",
        position: "absolute",
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        
    },
    slider: {
         //
        borderRadius: 5,
        height: "90%",
        width: "90%",
    }
})