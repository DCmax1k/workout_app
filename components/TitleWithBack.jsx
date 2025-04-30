import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'

import rightArrow from '../assets/icons/rightArrow.png'
import { router } from 'expo-router'

const TitleWithBack = ({style, backBtn = true, ...props}) => {
  return (
    <View style={[{position: "relative",  marginTop: 20,}, style]} {...props}>
        {backBtn &&
        <Pressable onPress={() => {router.back()}} style={styles.backBtn}>
            <Image style={styles.backBtnIcon} source={rightArrow} />
        </Pressable>}
        
        <ThemedText style={{fontSize: 20, fontWeight: 700, textAlign: 'center'}}>{props.title}</ThemedText>
    </View>
  )
}

export default TitleWithBack

const styles = StyleSheet.create({
    backBtn: {
        position: "absolute",
        top: "50%",
        left: 0,
        transform: [{translateY: -25}],
        height: 50, 
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        zIndex: 10,
    },
    backBtnIcon: {
        width: 20,
        height: 20,
        transform: [{rotate: "180deg"}],
        // backgroundColor: "white",
    },
})