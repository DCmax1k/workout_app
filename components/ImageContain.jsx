import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import exIcon from '../assets/icons/aiSparkle.png'
import { Image } from 'expo-image'

const ImageContain = ({style, imgStyle, source=exIcon, cover=false, size=20, ...props}) => {
  return (
    <View style={[{height: size, width: size},style]} {...props}>
      <Image source={source} contentFit= {cover ? "cover" : 'contain'} style={[{height: "100%", width: "100%",}, imgStyle]} />
    </View>
  )
}

export default ImageContain

const styles = StyleSheet.create({})