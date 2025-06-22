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
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConfirmMenu = ({ style, data, active, setActive, ...props }) => {
    const closeAndConfirm = () => {
        setActive(false);
        data.confirm();
    }

  return (
    <>
      <Portal>
          {active && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fullScreenOverlay}>
            {/* BACKDROP - dismisses when tapped */}
            {/* <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setActive(false)}
            /> */}

            {/* MENU - not affected by backdrop press */}
            <Animated.View entering={FadeInDown} exiting={FadeOutDown}  style={[ styles.menu,]}>

              <Text style={[styles.title]}>{data.title}</Text>
              <Spacer height={10} />
              <Text style={[styles.text]}>{data.subTitle}</Text>
              {data.subTitle2 && <Text style={[styles.text]}>{data.subTitle2}</Text>}
              <Spacer height={10} />
              <View style={styles.buttons}>
                <Pressable onPress={closeAndConfirm} style={[styles.button, {backgroundColor: data.option1color || Colors.primaryBlue}]}>
                    <Text style={[styles.title]}>{data.option1}</Text>
                </Pressable>
                {data.option2 && <Pressable onPress={() => {setActive(false)}} style={styles.button}>
                    <Text style={[styles.title]}>{data.option2}</Text>
                </Pressable>}
              </View>

            </Animated.View>
          </Animated.View>
        )}
      </Portal>
    </>
  );
};

export default ConfirmMenu;

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
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    position: "absolute",
    top: screenHeight/2 - 150,
    width: screenWidth - 40,
    marginHorizontal: 20,
    padding: 5,
    paddingVertical: 20,
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
