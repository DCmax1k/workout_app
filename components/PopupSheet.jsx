import React, { useRef, useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Portal } from 'react-native-paper';
import Spacer from './Spacer';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, LinearTransition, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PopupSheet = ({ style, active, setActive, data, ...props }) => {

    const close = () => {
        setActive(false);

    }

    

  return (
    <>
      <Portal>
          {active && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fullScreenOverlay}>
            <Pressable onPress={close} style={{height: screenHeight, width: screenWidth}} />
            {/* BACKDROP - dismisses when tapped */}
            {/* <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setActive(false)}
            /> */}

            {/* MENU - not affected by backdrop press */}
            <Animated.View layout={LinearTransition.springify().damping(80)} entering={SlideInDown.springify().damping(90)} exiting={SlideOutDown}  style={[ styles.menu ]}>

            <View >
                {props.children}
                <Spacer />
            </View>
              

            </Animated.View>
          </Animated.View>
        )}
      </Portal>
    </>
  );
};

export default PopupSheet;

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  menu: {
    backgroundColor: "#303030",
    borderRadius: 20,
    position: "absolute",
    bottom: -80,
    left: 0,
    minHeight: 100,
    width: screenWidth,
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  text: {
    fontSize: 15,
    color: "grey",
    textAlign: "center",
  },
  buttons: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#535353",
    paddingVertical: 15, 
    marginTop: 10,
    borderRadius: 10,
  }
});
