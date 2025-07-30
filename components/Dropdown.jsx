import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import dropdown from '../assets/icons/dropdown.png'
import { Image } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, { Easing, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Dropdown = ({data, height = 50,maxHeight = 225, style, selectedId, setSelectedId, locked = false,  ...props}) => {
    const [active, setActive] = useState(false);

    const selected = data.find(d => d.id === selectedId);
    const notSelected = data.filter(d => d.id !== selectedId);

    let scrollViewHeight = (data.length-1)*height;
    if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;

    // Animation slide
    const h = active ? height*data.length : height;

    const totalHeight = data.length * height;
    if (totalHeight > maxHeight) scrollViewHeight = maxHeight;

    const heightAnim = useSharedValue(height);
    const heightAnimationStyle = useAnimatedStyle(() => {
            return {
                height: heightAnim.value,
            }
          }, [])

        
    const slideTiming = (destination) => {
        return withTiming(destination, {
            duration: 300,
            easing: Easing.bezier(0.45, 0.78, 0.34, 0.98),
        });
    }

    const selectItem = (itemID) => {
        setSelectedId(itemID);
        if (active) {
            setActive(false);
            heightAnim.value = slideTiming(height);
            return;
        }
        setActive(!active);
        heightAnim.value = height;
    }

    const toggleItems = () => {
        if (active) {
            setActive(false);
            heightAnim.value = slideTiming(height);
            return;
        }
        setActive(!active);
        heightAnim.value = slideTiming(height*data.length);
        
    }

  return (
    <Animated.View style={[styles.mainCont, {overflow: "hidden", zIndex: active ? 10 : 0}, style, heightAnimationStyle]} >
        <Pressable key={selected.id} style={[styles.item, {height: height, fontSize: 18, backgroundColor: "#3D3D3D", borderTopWidth: 0, borderRadius: 10}]} onPress={locked ? () => {} : toggleItems}>
            <Text style={[styles.itemText, {fontWeight: 700}]}>{selected.title}</Text>
        </Pressable>

        {(
        <View style={{maxHeight: maxHeight, width: '100%', elevation: 100, zIndex: 100}}>
            <ScrollView style={{height: scrollViewHeight, backgroundColor: "#323232", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} >
                {notSelected.map((item, i) => {
                return (<Pressable key={item.id} style={[styles.item, {height: height, fontSize: 18,},]} onPress={() => selectItem(item.id)}>
                        <Text style={[styles.itemText]}>{item.title}</Text>
                    </Pressable>
                    )})}
            </ScrollView>
        </View>
        )}
        

        <Image style={{position: 'absolute', height: 20, width: 20, objectFit: "contain", right: 10, top: 15, tintColor: "#546FDB"}} source={dropdown} />
        
    </Animated.View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
    mainCont: {
        backgroundColor: "#323232",
        borderRadius: 10,
    },
    item: {
        justifyContent: "center",
        alignItems: "flex-start",
        borderTopWidth: 1,
        borderTopColor: "#565656",
        backgroundColor: "#323232",
    },
    itemText: {
        color: "white",
        fontSize: 18,
        paddingLeft: 10
    }
})