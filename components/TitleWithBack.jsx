import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import ThemedText from './ThemedText'

import rightArrow from '../assets/icons/rightArrow.png'
import { router } from 'expo-router'
import threeEllipses from '../assets/icons/threeEllipses.png'
import ActionMenu from './ActionMenu'
import trash from '../assets/icons/trash.png'
import { Colors } from '../constants/Colors'

const screenWidth = Dimensions.get("window").width;

const TitleWithBack = ({style, backBtn = true, leftBtnNotification=false, actionBtnIconStyles, leftActionBtnIconStyles, backFunction = () => router.back(), actionBtn = {active: false, actionMenu: false, image: threeEllipses, options: [{title: "Delete workout", icon: trash, onPress: () => console.log("Pressed"),}], },  leftActionBtn = {active: false, actionMenu: false, image: threeEllipses, options: [{title: "Delete workout", icon: trash, onPress: () => console.log("Pressed"),}], }, ...props}) => {

  return (
    <View style={[{position: "relative",  marginTop: 20, width: screenWidth,}, style]} {...props}>
        {leftActionBtn.active ? ( 
            <Pressable onPress={leftActionBtn.action} style={styles.backBtn}>
                {leftBtnNotification && (
                    <View style={{position: "absolute", height: 7, width: 7, backgroundColor: Colors.protein, borderRadius: 9999, top: 8, right: 8}}></View>
                )}
                <Image style={[styles.actionBtnIcon, leftActionBtnIconStyles]} source={leftActionBtn.image} />
            </Pressable>
        ) : backBtn ? (
            <Pressable onPress={() => {backFunction() }} style={styles.backBtn}>
                <Image style={styles.backBtnIcon} source={rightArrow} />
            </Pressable>
        ) : null}
        {/* {backBtn &&
        <Pressable onPress={() => {backFunction() }} style={styles.backBtn}>
            <Image style={styles.backBtnIcon} source={rightArrow} />
        </Pressable>} */}
        
        <View style={{width: "100%", alignItems: "center"}}>
            <View style={{maxWidth: "70%",}}>
                <ThemedText numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 20, fontWeight: 700, textAlign: 'center',}}>{props.title}</ThemedText>
            </View>
            
        </View>
        
        

        {(actionBtn.actionMenu === true) && (actionBtn.options.length > 0) ? (
            <ActionMenu pressableStyle={styles.actionBtn} data={actionBtn.options} />
        ) : null }
        {actionBtn.active &&
        <Pressable onPress={actionBtn.action} style={styles.actionBtn}>
            <Image style={[styles.actionBtnIcon, actionBtnIconStyles]} source={actionBtn.image} />
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