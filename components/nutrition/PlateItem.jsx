import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from '../../constants/icons';
import { Colors } from '../../constants/Colors';
import MacrosRow from './MacrosRow';

const PlateItem = ({style, food, clickChangeQuantity, ...props}) => {

    const icon = food.icon ? icons[food.icon] : icons["fooddoodles303"];
    const size = 60;

  return (
    <View style={[style, {height: size, width: "100%", backgroundColor: "#272727", borderRadius: 10, flexDirection: "row" }]} {...props}>
        {/* ICON */}
        <View style={{height: size, width: size, justifyContent: "center", alignItems: "center"}}>
            <View style={{height: size/1.5, width: size/1.5, backgroundColor: food.color, borderRadius: 10, justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
                <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.3)"}]}></View>
                <Image source={icon} style={{height: size/1.5, width: size/1.5, objectFit: "contain", tintColor: "white"}} />
            </View>
        </View>
        {/* Name and details */}
        <View style={{flexDirection: "column", height: size, justifyContent: "center", marginRight: "auto"}}>
            <Text style={{color: "white", fontSize: 14, fontWeight: "600"}}>{food.name}</Text>
            <MacrosRow nutrition={food.nutrition} multiplier={food.quantity} />
        </View>
        {/* Serving input */}
        <View style={{height: size, justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
            <Pressable onPress={() => clickChangeQuantity(food)} style={{height: size/1.5, backgroundColor: "#333333", borderRadius: 10, justifyContent: 'center', alignItems: "center", paddingHorizontal: 10}}>
                <Text style={{color: "white", fontSize: 14, fontWeight: "600",}}>{food.quantity} {food.unit}</Text>
            </Pressable>
            
        </View>
    </View>
  )
}

export default PlateItem

const styles = StyleSheet.create({})