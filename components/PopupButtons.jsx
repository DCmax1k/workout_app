import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { act, forwardRef, useImperativeHandle, useState } from 'react'
import { Colors } from '../constants/Colors'
import { Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import xIcon from "../assets/icons/whiteX.png"

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const PopupButtons = forwardRef(({
    setParentActive,
    height=60, width=300,
    color=Colors.protein,
    textColor="white",
    style,
    buttons=[],
    ...props
}, ref) => {
    const [active, setActive] = useState(false);
    const buttonBorderWidth = 3;
    const buttonSpacing = 10;

    useImperativeHandle(ref, () => ({
        setActiveFalse: () => {
            setActive(false);
        }
    }))

    const closeMenu = () => {
        setActive(!active);
        setParentActive(!active)
    }

  return (
    <View style={[{width, zIndex: 10}, style]} {...props}>

        {/* Bottom button */}
        <Pressable onPress={closeMenu}>
            {active && (<Animated.View entering={FadeIn} exiting={FadeOut} style={[{position: "relative", backgroundColor: "transparent", borderWidth: buttonBorderWidth, borderColor: color, borderRadius: 9999999, width, height, justifyContent: "center", alignItems: "center"}]}>
                <Text style={{color: textColor, fontSize: 20, fontWeight: "800"}}>Close</Text>
                 <View style={{height: height, width: 30, position: "absolute", top: 0-buttonBorderWidth, left: 10, justifyContent: "center", alignItems: "center",}}>
                    <Image source={xIcon} style={{height: 30, width: 30, objectFit: "contain"}} />
                </View>
            </Animated.View>)}
            {!active && (<Animated.View entering={FadeIn} exiting={FadeOut} style={[{position: "relative", backgroundColor: color, borderWidth: buttonBorderWidth, borderColor: color, borderRadius: 9999999, width, height, justifyContent: "center", alignItems: "center"}]}>
                <Text style={{color: textColor, fontSize: 20, fontWeight: "800"}}>Log food for today</Text>
            </Animated.View>)}
        </Pressable>

        {/* Options menu, each child is absolute positioned */}
        {buttons.map((button, i) => {
                const reverseIndex = buttons.length - i;
                const bottom = (height+buttonSpacing)*reverseIndex - buttonSpacing;
                const delay = ((reverseIndex-1) * 30);
                const iconSize = button.iconSize || 20;
                return active && (
                    <Animated.View key={i} entering={FadeInDown.duration(200).delay(delay)} exiting={FadeOutDown} style={{paddingBottom: buttonSpacing, position: "absolute", left: 0, bottom,}}>
                        <Pressable onPress={() => {closeMenu(); button.onPress();}} >
                            <View entering={FadeInDown} exiting={FadeOutDown} style={[{position: "relative", backgroundColor: color, borderWidth: buttonBorderWidth, borderColor: color, borderRadius: 9999999, width, height, justifyContent: "center", alignItems: "center"}]}>
                                <Text style={{color: textColor, fontSize: 20, fontWeight: "800"}}>{button.text}</Text>
                                {button.icon && (
                                    <View style={{height: height, width: iconSize > 30 ? iconSize : 30, position: "absolute", top: 0-buttonBorderWidth, left: 10, justifyContent: "center", alignItems: "center", }}>
                                        <Image source={button.icon} style={{height: iconSize, width: iconSize, objectFit: "contain"}} />
                                    </View>
                                    
                                    )}
                            </View>
                        </Pressable>
                    </Animated.View>
                    
                    
                )
            })}
      
    </View>
  )
})

export default PopupButtons

const styles = StyleSheet.create({})