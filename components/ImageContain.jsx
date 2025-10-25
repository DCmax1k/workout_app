import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import exIcon from '../assets/icons/aiSparkle.png'

const ImageContain = ({style, imgStyle, source=exIcon, size=20, ...props}) => {
  return (
    <View style={[{height: size, width: size},style]} {...props}>
      <Image source={source} style={[{height: "100%", width: "100%", objectFit: "contain"}, imgStyle]} />
    </View>
  )
}

export default ImageContain

const styles = StyleSheet.create({})