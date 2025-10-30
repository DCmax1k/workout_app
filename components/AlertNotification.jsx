import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Portal } from 'react-native-paper'
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from 'react-native-reanimated'

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const AlertNotification = () => {


  return (
    <>
      <Portal>
            {/* Screen overlay is always shown */}
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fullScreenOverlay}>
            {/* BACKDROP - dismisses when tapped */}
            {/* <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setActive(false)}
            /> */}

            {/* MENU - not affected by backdrop press */}
            <View style={{flex: 1}}>
                
            </View>

              

          </Animated.View>

      </Portal>
    </>
  )
}

export default AlertNotification

const styles = StyleSheet.create({
    fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    pointerEvents: "none",
  },
})