import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedText from './ThemedText'

import rightArrow from '../assets/icons/rightArrow.png'
import { router } from 'expo-router'
import threeEllipses from '../assets/icons/threeEllipses.png'
import ActionMenu from './ActionMenu'
import trash from '../assets/icons/trash.png'

const screenWidth = Dimensions.get("window").width;

const TitleWithBack = ({style, backBtn = true, backFunction = () => router.back(), actionBtn = {active: false, actionMenu: false, image: threeEllipses, action: () => console.log("Pressed")}, ...props}) => {



  return (
    <View style={[{position: "relative",  marginTop: 20, width: screenWidth,}, style]} {...props}>
        {backBtn &&
        <Pressable onPress={() => {backFunction() }} style={styles.backBtn}>
            <Image style={styles.backBtnIcon} source={rightArrow} />
        </Pressable>}
        
        <ThemedText style={{fontSize: 20, fontWeight: 700, textAlign: 'center'}}>{props.title}</ThemedText>

        {actionBtn.actionMenu === true ? (
            <ActionMenu style={styles.actionBtn} data={[{title: "Delete workout", icon: trash, onPress: actionBtn.action,}]} />
        ) : null }
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
        left: 6,
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
        right: 6,
        transform: [{translateY: -25}],
        height: 50, 
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        zIndex: 1,
    },
    actionBtnIcon: {
        width: 20,
        height: 20,
        objectFit: 'contain',
        // backgroundColor: "white",
    },
})