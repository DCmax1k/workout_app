import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import ImageContain from './ImageContain'
import aiSparkle from '../assets/icons/aiSparkle.png'

export default function AIButton({style, title, onPress, fontSize=15, imageSize=20, height=50, ...props}) {
  return (
    <Pressable onPress={onPress} style={[style,]} {...props}>
        <LinearGradient
            style={[styles.linearGradient, {height}]}
            colors={["#6C89FF", "#C030B2"]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}
        >
        <View style={[StyleSheet.absoluteFill, {backgroundColor: "#ffffff28"}]}></View>
            <View style={[styles.dropShadow, {paddingHorizontal: 10, height: height-10, alignItems: 'center',}]}>
                <ImageContain source={aiSparkle} size={imageSize} style={{marginTop: 1,}} />
                <Text style={{color: "white", fontSize, marginLeft: 5, fontWeight: "600"}}>{title}</Text>
            </View>
        </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    linearGradient: {
        padding: 5,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dropShadow: {
        borderRadius: 12,
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