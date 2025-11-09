import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ImageContain from './ImageContain'
import profileIcon from '../assets/icons/profileIcon.png'

const ProfileImg = ({style, profileImg, size=25, ...props}) => {
  return (
    <ImageContain style={[style, {backgroundColor: "grey", borderRadius: 9999}]} imgStyle={{borderRadius: 9999}} size={size} source={profileImg.url ? {uri: profileImg.url} : profileIcon} />
  )
}

export default ProfileImg

const styles = StyleSheet.create({})