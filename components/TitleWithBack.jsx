import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'

import rightArrow from '../assets/icons/rightArrow.png'
import { router } from 'expo-router'
import threeEllipses from '../assets/icons/threeEllipses.png'

const TitleWithBack = ({style, backBtn = true, actionBtn = {active: false, image: threeEllipses, action: () => console.log("Pressed")}, ...props}) => {
  return (
    <View style={[{position: "relative",  marginTop: 20,}, style]} {...props}>
        {backBtn &&
        <Pressable onPress={() => {router.back()}} style={styles.backBtn}>
            <Image style={styles.backBtnIcon} source={rightArrow} />
        </Pressable>}
        
        <ThemedText style={{fontSize: 20, fontWeight: 700, textAlign: 'center'}}>{props.title}</ThemedText>

        {actionBtn.active &&
        <Pressable onPress={actionBtn.action} style={styles.actionBtn}>
            <Image style={styles.actionBtnIcon} source={actionBtn.image} />
        </Pressable>}

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
        objectFit: 'contain',
        // backgroundColor: "white",
    },
    actionBtn: {
        position: "absolute",
        top: "50%",
        right: 0,
        transform: [{translateY: -25}],
        height: 50, 
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        zIndex: 10,
    },
    actionBtnIcon: {
        width: 20,
        height: 20,
        objectFit: 'contain',
        // backgroundColor: "white",
    },
})