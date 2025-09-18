import { Dimensions, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedText from './ThemedText'
import Animated, { 
  FadeIn, 
  FadeOut, 
  LinearTransition, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated'

const screenWidth = Dimensions.get('screen').width

const ProgressBar = ({ 
  style, 
  value = 1, 
  goal = 2, 
  color = "#DBD654", 
  width = screenWidth - 40, 
  ...props 
}) => {
  
  const progress = useSharedValue(0) // shared animated width

  const frac = goal && value ? value / goal : 0
  const progressBarW = width
  const targetWidth = frac >= 1 ? progressBarW : frac * progressBarW

  // Animate when `value` changes
  useEffect(() => {
    progress.value = withTiming(targetWidth, { duration: 500 }) // 500ms ease
  }, [targetWidth])

  // Bind animation to style
  const animatedStyle = useAnimatedStyle(() => ({
    width: progress.value,
    backgroundColor: color
  }))

  // Overflow marker
  let overflowRatioW = 0
  if (frac > 1.05) {
    const overflowRatio = goal / value
    overflowRatioW = progressBarW * overflowRatio - 4 // subtract marker width
  }

  return (
    <View 
      style={[
        styles.progressBar, 
        { width: progressBarW, marginBottom: frac > 1.05 ? 10 : 0 }, 
        style
      ]} 
      {...props}
    >
      {/* Animated progress bar */}
      <Animated.View style={[styles.progressBarProgress, animatedStyle]} />

      {/* Overflow marker */}
      {frac > 1.05 && (
        <Animated.View 
          layout={LinearTransition} 
          entering={FadeIn} 
          exiting={FadeOut} 
          style={[styles.marker, { left: overflowRatioW }]}
        >
          <ThemedText 
            style={{
              position: "absolute", 
              top: 13, 
              left: -25, 
              textAlign: "center", 
              width: 50, 
              fontSize: 13, 
              color: "#7D7D7D"
            }}
          >
            {goal}
          </ThemedText>
        </Animated.View>
      )}
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    borderRadius: 9999,
    backgroundColor: "#3A3A3A",
    position: "relative",
  },
  progressBarProgress: {
    height: 10,
    borderRadius: 999999,
  },
  marker: {
    position: "absolute",
    top: 0,
    height: 10,
    width: 4,
    backgroundColor: "black",
  }
})
