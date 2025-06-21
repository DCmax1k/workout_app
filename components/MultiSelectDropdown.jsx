import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import dropdown from '../assets/icons/dropdown.png'
import { Image } from 'react-native';
import whiteX from '../assets/icons/whiteX.png'
import { Portal } from 'react-native-paper';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const MultiSelectDropdown = ({data, height = 50, maxHeight = 225, style, selectedIds, setSelectedIds,  ...props}) => {
    const [active, setActive] = useState(false);

    const selected = selectedIds.map(id => data.find(d=>d.id===id));
    const notSelected = data.filter(d => !selectedIds.includes(d.id));

    let scrollViewHeight = (notSelected.length)*height;
    if (scrollViewHeight > maxHeight) scrollViewHeight = maxHeight;


    // Ahnimation slide
    const h = active ? height*data.length > (maxHeight+height) ? (maxHeight+height) : height*data.length : height;

    const slideTiming = (destination) => {
            return withTiming(destination, {
                duration: 300,
                easing: Easing.bezier(0.45, 0.78, 0.34, 0.98),
            });
        }

    const removeItem = (id) => {
        if (active) {
            heightAnim.value = slideTiming((height*notSelected.length+height) > (maxHeight) ? (maxHeight) : height*notSelected.length+height);
        }
        

        const newSelected = selectedIds.filter(it => it !== id);
        //setActive(false);
        setSelectedIds(newSelected);
    }

    const heightAnim = useSharedValue(0);
        const heightAnimationStyle = useAnimatedStyle(() => {
                return {
                    height: heightAnim.value,
                }
              }, [])

    const toggleItems = () => {
        if (active) {
            setActive(false);
            heightAnim.value = slideTiming(0);
            return;
        }
        setActive(!active);
        heightAnim.value = slideTiming(height*notSelected.length > (maxHeight) ? (maxHeight) : height*notSelected.length);
    }

    const selectItem = (id) => {
        heightAnim.value = slideTiming((height*notSelected.length-height) > (maxHeight) ? (maxHeight) : height*notSelected.length-height);
        const newSelected = [...selectedIds, id];
        //setActive(false);
        setSelectedIds(newSelected);

    }


  return (
    <View>
        {/* Dropdown */}
        <View style={[styles.mainCont, {overflow: "visible", zIndex: active ? 10 : 0}, style]} >
            <Pressable key={selected.id} style={[styles.item, {height: height, fontSize: 18, backgroundColor: "#3D3D3D", borderTopWidth: 0, borderRadius: 10}]} onPress={toggleItems}>
                <Text style={[styles.itemText]}>Pick from selection</Text>
            </Pressable>

            {(
                <Animated.View style={[{width: "100%", elevation: 100, zIndex: 100}, heightAnimationStyle]}>
                    <View style={{flex: 1,}}>
                        <ScrollView style={{ backgroundColor: "#323232", borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} >
                    {notSelected.map((item, i) => {
                        return (<Pressable key={item.id} style={[styles.item, {height: height, fontSize: 18,},]} onPress={() => {selectItem(item.id);}}>
                                <Text style={[styles.itemText]}>{item.title}</Text>
                            </Pressable>
                        )})}
                    </ScrollView>
                    </View>
                    
                </Animated.View>
            )}
            
            

            <Image style={{position: 'absolute', height: 20, width: 20, objectFit: "contain", right: 10, top: 15, tintColor: "#546FDB"}} source={dropdown} />
            
        </View>
                
        {/* Items */}
        <View style={{flexDirection: "row", flexWrap: 'wrap', }}>
            {selected.map(item => {
                return (
                <Pressable onPress={() => {removeItem(item.id)}} key={item.id} style={{flexDirection: 'row', alignItems: 'center', marginRight: 5, marginBottom: 5, paddingVertical: 2, paddingHorizontal: 10, backgroundColor: "#3C3C3C", borderRadius: 9999,}}>
                    <Image style={{height: 15, width: 15, objectFit: "contain", marginLeft: -5, marginRight: 3, tintColor: "grey", }} source={whiteX} />
                    <Text style={{ fontSize: 14, color: "white"}}>{item.title}</Text>
                    
                </Pressable>
            )})}
        </View>

    </View>
    
  )
}

export default MultiSelectDropdown

const styles = StyleSheet.create({
    mainCont: {
        backgroundColor: "#323232",
        borderRadius: 10,
        marginBottom: 5,
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