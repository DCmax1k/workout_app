import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import trash from '../assets/icons/trash.png'
import ConfirmMenu from './ConfirmMenu';

const screenWidth = Dimensions.get("window").width;

const TRASH_WIDTH = 100;


function RightAction({prog, drag, isOpen, setIsOpen}) { 
  const styleAnimation = useAnimatedStyle(() => {
    // console.log('showRightProgress:', prog.value);
    // console.log('appliedTranslation:', drag.value);

    

    const translateAmount = Math.abs(drag.value) > TRASH_WIDTH ? (0) : (drag.value + TRASH_WIDTH);

    return {
      transform: [{ translateX: translateAmount }],
    };
  });

  return (
    <Reanimated.View style={[{width: TRASH_WIDTH, height: "100%", justifyContent: "center", alignItems: "center"}, styleAnimation]}>
      <Image source={trash} style={{height: 30, width: 30, objectFit: "contain", tintColor: "#A94A4A"}} />
    </Reanimated.View>
  );
}



const SwipeToDelete = forwardRef(({children, style, onPress, openedRight, showConfirmation=false, confirmationData={}, ...props}, ref) => {

    const swipeRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [confirmMenuActive, setConfirmMenuActive] = useState(false);
    const [confirmMenuData, setConfirmMenuData] = useState();

     useImperativeHandle(ref, () => ({
      getIsOpen: () => isOpen,
    }));

    const closeSwipeable = () => {
        swipeRef.current.close();
        
    }

    const defaultConfirmationData={
        title: "Delete exercise?",
        subTitle: "Are you sure you would like to delete this exercise?",
        subTitle2: "This action cannot be undone.",
        option1: "Delete exercise",
        option1color: "#DB5454",
        option2: "Go back",
        confirm: () => console.log("confirmed"),
        goback: () => closeSwipeable(),
    }
                
    const requestDeleteConfirmation = () => {
      if (!showConfirmation) return openedRight();
        setConfirmMenuData({...defaultConfirmationData, ...confirmationData});
        setConfirmMenuActive(true);
    }

  return (
    <View style={[styles.cont, style]} {...props} >
        {/* <Pressable onPress={() => {
            if (!isOpen) return onPress();
            
        }} > */}
        <ConfirmMenu active={confirmMenuActive} setActive={setConfirmMenuActive} data={confirmMenuData} />
            <Swipeable
            ref={swipeRef}
                friction={1.3}
                rightThreshold={screenWidth/2}
                renderRightActions={(prog, drag) => <RightAction prog={prog} drag={drag} isOpen={isOpen} setIsOpen={setIsOpen} />}
                onSwipeableOpenStartDrag={() => {setIsOpen(true);}}
                onSwipeableClose={() => {setIsOpen(false); }}

                onSwipeableWillOpen={(dir) => {if (dir === "left") {requestDeleteConfirmation()}}}
            >

                {children}

            </Swipeable>
        {/* </Pressable> */}
        
        

    </View>
  )
})

export default SwipeToDelete

const styles = StyleSheet.create({
    cont: {
        width: "100%",

    }
})