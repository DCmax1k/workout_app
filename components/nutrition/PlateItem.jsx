import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from '../../constants/icons';
import { Colors } from '../../constants/Colors';
import MacrosRow from './MacrosRow';
import { truncate } from '../../util/truncate';
import { Image } from 'expo-image';
const screenWidth = Dimensions.get('screen').width;

const PlateItem = ({style, food, clickChangeQuantity, width = screenWidth-20, edit=true, ...props}) => {

    const icon = food.icon ? icons[food.icon] : null;
    const size = 60; 

  return (
    <View style={[{height: size, width, backgroundColor: "#272727", borderRadius: 10, flexDirection: "row", }, style]} {...props}>
        {/* ICON */}
        <View style={{height: size, width: size, justifyContent: "center", alignItems: "center"}}>
            <View style={{height: size/1.5, width: size/1.5, backgroundColor: food.color, borderRadius: 10, justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                {/* <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.3)"}]}></View> */}
                <Image source={icon} style={{height: size/1.5, width: size/1.5, objectFit: "contain", tintColor: food.iconColor ?? "white"}} />
            </View>
        </View>
        {/* Name and details */}
        <View style={{flexDirection: "column", height: size, justifyContent: "center", marginRight: "auto"}}>
            <Text style={{color: "white", fontSize: 14, fontWeight: "600"}}>{truncate(food.name, 25)}</Text>
            <MacrosRow nutrition={food.nutrition} multiplier={food.quantity} showDecimal={false} />
        </View>
        {/* Serving input */}
        <View style={{height: size, justifyContent: "center", alignItems: "center", paddingRight: 10, marginLeft: 5, }}>
            <Pressable onPress={edit ? () => clickChangeQuantity(food) : () => {} } style={{height: size/1.5, backgroundColor: edit ? "#333333" : "transparent", borderColor: edit ? "#272727" : "transparent", borderWidth: 2,  borderRadius: 10, justifyContent: 'center', alignItems: "center", paddingHorizontal: 10}}>
                <Text style={{color: "white", fontSize: 14, fontWeight: "600",}}>{food.quantity} {food.unit}</Text>
            </Pressable>
            
        </View>
    </View>
  )
}

export default PlateItem

const styles = StyleSheet.create({})