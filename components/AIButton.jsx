import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import ImageContain from './ImageContain'
import aiSparkle from '../assets/icons/aiSparkle.png'
import premiumBadge from '../assets/icons/premiumBadge.png'

export default function AIButton({style, title, onPress, fontSize=15, imageSize=20, height=50, icon=aiSparkle, quickIcon=null, borderRadius=15, paddingHorizontal=10, ...props}) {


    const quickIcons = [aiSparkle, premiumBadge];
    if (quickIcon) {
        icon = quickIcons[quickIcon]
    }

  return (
    <Pressable onPress={onPress} style={[style,]} {...props}>
        <LinearGradient
            style={[styles.linearGradient, {height, borderRadius}]}
            colors={["#6C89FF", "#C030B2"]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}
        >
        <View style={[StyleSheet.absoluteFill, {backgroundColor: "#ffffff28"}]}></View>
            <View style={[styles.dropShadow, {paddingHorizontal, height: height-10, alignItems: 'center', borderRadius: 0.8*borderRadius}]}>
                <ImageContain source={icon} size={imageSize} style={{marginTop: 1,}} />
                <Text style={{color: "white", fontSize, marginLeft: 5, fontWeight: "600"}}>{title}</Text>
            </View>
        </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    linearGradient: {
        padding: 5,
        overflow: 'hidden',
    },
    dropShadow: {
        backgroundColor: "#686868",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    }
})