import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import filterIcon from '../assets/icons/filter.png'
import greyX from '../assets/icons/greyX.png'
import Animated, { SlideInRight, SlideOutRight, Easing, LinearTransition, FadeOutDown, SlideOutLeft, SlideInLeft, FadeInRight, FadeOutRight, FadeIn, FadeOut } from 'react-native-reanimated'

const screenWidth = Dimensions.get("screen").width;

const Option = ({style, label, onPress, iconScale=1, backgroundColor="#3D3D3D", icon=null}) => {
    return (
        <Pressable onPress={onPress} style={[{padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor, gap: 5}, style]}>
            {icon && <View style={{width: 20, height: 20, marginRight: 5, justifyContent: "center", alignItems: "center"}}>
                <Image source={icon} style={{width: "100%", height: "100%", objectFit: 'contain', tintColor: "white", transform: [{scale: iconScale}]}} />
            </View>}
            <Text style={{color: "white", fontWeight: "400", fontSize: 18}}>{label}</Text>
        </Pressable>
    )
}

// CURRENT WORKING ON THIS, MAKE IT ACTUALLY FILTER THE PARENT
const FilterAndSort = forwardRef(({style, selected, setSelected, options = ["Chest", "Abs", "Back", "Biceps", "Triceps", "Forearms", "Shoulders", "Legs"], ...props}, ref) => {

    // Moved to parent
    // const [selected, setSelected] = useState([]);
    const [showOptions, setShowOptions] = useState(false);

    const optionsScrollViewRef = useRef(null);
    const noOptionsScrollViewRef = useRef(null);

    useEffect(() => {
        // Wait a tick for layout, then scroll to end (right)

        if (showOptions) {
            if (optionsScrollViewRef.current) {
                optionsScrollViewRef.current.scrollToEnd({ animated: false });
            }
        } else {
            if (noOptionsScrollViewRef.current) {
                noOptionsScrollViewRef.current.scrollToEnd({ animated: false });
            }
        }
        
        

    }, [showOptions]);

  return (
    <View style={[{width: screenWidth,}, style]} {...props}>
      <View horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row', paddingVertical: 10, ...style}} contentContainerStyle={{paddingLeft: 10}}>
        {!showOptions && (
        <Animated.ScrollView ref={noOptionsScrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 10, flexDirection: 'row-reverse', justifyContent: "flex-start", minWidth: "100%", alignItems: 'center', gap: 10}}>
            
            <Animated.View key={"filterBtn"} entering={FadeIn} exiting={FadeOut}>
                    <Option label={"Filter"} icon={showOptions ? greyX : filterIcon} iconScale={showOptions ? 1.3 : 1} onPress={() => setShowOptions(!showOptions)} style={{marginRight: 0}} />
            </Animated.View>
            {selected.map((option, index) => (
                <Animated.View key={index} entering={SlideInLeft} exiting={SlideOutLeft}>
                    <Option key={option} label={option} icon={greyX} iconScale={1.3} backgroundColor={"#303A66"} onPress={() => {
                        let newSelected = selected.filter((item) => item !== option);
                        setSelected(newSelected);
                    }} />
                </Animated.View>
                
            ))}
            
        </Animated.ScrollView>
        )}

        {showOptions && (
            <Animated.ScrollView ref={optionsScrollViewRef} key={"showOptions"}  horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 10, flexDirection: 'row-reverse', justifyContent: "flex-start", minWidth: "100%", alignItems: 'center', gap: 10}}>
                <Animated.View key={"filterBtn"} entering={FadeIn} exiting={FadeOut}>
                    <Option label={"Filter"} icon={showOptions ? greyX : filterIcon} iconScale={showOptions ? 1.3 : 1} onPress={() => setShowOptions(!showOptions)} style={{marginRight: 0}} />
                </Animated.View>
                {options.filter(o => !selected.includes(o)).map((option, index) => (
                    <Animated.View key={option} entering={SlideInLeft} exiting={SlideOutLeft}>
                        <Option label={option} icon={null} iconScale={1} backgroundColor={"#3D3D3D"} onPress={() => {
                            if (selected.includes(option)) {
                                let newSelected = selected.filter((item) => item !== option);
                                setSelected(newSelected);
                                setShowOptions(false);
                            } else {
                                setSelected([...selected, option]);
                                setShowOptions(false);
                            }
                        }} />
                    </Animated.View>
                    
                ))}
                
            </Animated.ScrollView>
        )}


    </View>
    </View>
  )
})

export default FilterAndSort

const styles = StyleSheet.create({})