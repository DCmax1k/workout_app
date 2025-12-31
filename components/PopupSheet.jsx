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
import Animated, { FadeIn, FadeOut, LinearTransition, SlideInDown, SlideOutDown, } from 'react-native-reanimated';
import doubleCarrot from '../assets/icons/doubleCarrot.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const doneHeight = 60;
const doneWidth = 120;
const doneBorderRadius = 20;
const trapWidth = 25;
const trapHeight = doneHeight - (doneBorderRadius/2) + 2;

const PopupSheet = ({ style, active, setActive, data, onClose=()=>{}, ...props }) => {

    const close = () => {
        onClose();
        setActive(false);

    }

    


  return (
    <>
      <Portal>
          {active && (
          <View  style={styles.fullScreenOverlay}>
            <Animated.View entering={FadeIn} exiting={FadeOut} zstyle={{zIndex: -2}}>
              <Pressable  onPress={close} style={[{height: screenHeight, width: screenWidth,  backgroundColor: 'rgba(0,0,0,0.50)',}]} />
            </Animated.View>
            
            {/* BACKDROP - dismisses when tapped */}
            {/* <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setActive(false)}
            /> */}

            {/* MENU - not affected by backdrop press */}
            <View style={[ styles.menu ]}>

              {/* Done button */}
              <Animated.View entering={SlideInDown.springify().damping(100).delay(200)} exiting={SlideOutDown.duration(100)} style={{height: doneHeight, width: doneWidth, backgroundColor: "#444444", position: "absolute", top: -doneHeight/1.5, left: (screenWidth / 2) - (doneWidth/2), borderTopLeftRadius: doneBorderRadius, borderTopRightRadius: doneBorderRadius,}}>
                <View style={[styles.trapezoidBorder, {position: "absolute", bottom: 0, left: -(trapWidth - 4)}]} />
                <View style={[styles.trapezoidBorder, {position: "absolute", bottom: 0, right: -(trapWidth - 4)}]} />

                <Pressable onPress={close} style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, height: doneWidth/3, paddingRight: 5, width: doneWidth*2, transform: [{translateX: -doneWidth/2}],}}>
                  <View style={{height: doneWidth/5, width: doneWidth/5, justifyContent: "center", alignItems: "center",}}>
                    <Image source={doubleCarrot} style={{objectFit: "contain", height: "100%", width: "100%", marginBottom: 3, transform: [{rotate: "180deg"}]}} />
                  </View>
                  <Text style={{fontSize: 20, color: "white",}}>Done</Text>
                </Pressable>
              </Animated.View>

              {/* Content */}
              <Animated.View layout={LinearTransition.springify().damping(80)} entering={SlideInDown.springify().damping(90)} exiting={SlideOutDown} style={[styles.menuCont]} >
                  {props.children}
                  <Spacer />
              </Animated.View>
              

            </View>
          </View>
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
   
  },
  menu: {
    
    position: "absolute",
    bottom: -80,
    left: 0,
    minHeight: 100,
    width: screenWidth,
    
  },
  menuCont: {
    backgroundColor: "#303030",
    borderRadius: 20,
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
  },
  trapezoidBorder: {
    width: 0, /* Width of the bottom base */
    height: 0,
    borderBottomColor: "#444444",
    borderBottomWidth: trapHeight,
    borderLeftWidth: trapWidth,
    borderLeftColor: "transparent",
    borderRightWidth: trapWidth,
    borderRightColor: "transparent",
    zIndex: -1,
  }

});
