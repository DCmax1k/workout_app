import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import ActionMenu from './ActionMenu'
import searchIcon from '../assets/icons/search.png'
import keyboardIcon from '../assets/icons/keyboard.png';
import { Colors } from '../constants/Colors';
import Animated, { BounceInRight, BounceOutRight, FadeIn, FadeInRight, FadeOut, FadeOutRight, SlideOutRight } from 'react-native-reanimated';

const Search = ({style, actionMenuData = false, dismissKeyboard = false, ...props }) => {

  const [showDisKeyboard, setShowDisKeyboard] = React.useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.searchCont, {flex: 1}]}>
        
        <Image style={styles.searchIcon} source={searchIcon} />
        <TextInput {...props} style={[styles.search, {flex: 1}]} placeholder='Search' placeholderTextColor={"#A6A6A6"} onFocus={() => setShowDisKeyboard(true)} onBlur={() => setShowDisKeyboard(false)} />
        {/* Dismiss keyboard */}
        {dismissKeyboard && showDisKeyboard && (
          <Animated.View style={[styles.disKeyboard,]} entering={BounceInRight} exiting={SlideOutRight}>
            <Pressable style={{flex: 1}} onPress={() => {Keyboard.dismiss();}} >
              <Image style={{height: 30, width: 30, objectFit: 'contain'}} source={keyboardIcon} />
            </Pressable>
          </Animated.View>
        
      )}
      </View>
        
        
        { actionMenuData && (<ActionMenu style={{marginLeft: 10}} data={actionMenuData} />)}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    postion: "relative",
  },
  searchIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    tintColor: "#A6A6A6",
  },
  searchCont: {
    position: "relative",
      height: 50,
      
      backgroundColor: "#1C1C1C",
      borderRadius: 99999,
      paddingLeft: 50,
      paddingRight: 10,
  },
    search: {
      fontSize: 20,
      color: "white", 
    },
    disKeyboard:{
        height: 40,
        width: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "transparent",
        borderRadius: 10,
        borderColor: Colors.dark.background,
        borderWidth: 0,

        position: "absolute",
        right: 10,
        top: 5,
      }
})