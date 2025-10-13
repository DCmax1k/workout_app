import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { icons } from '../../constants/icons';
import { Colors } from '../../constants/Colors';

const PlateItem = ({style, food, ...props}) => {

    console.log("food item", food);

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
            <View style={{flexDirection: "row", gap: 5}}>
                {new Array(4).fill(null).map((_, i) => {
                    const nutritionKey = ["calories", "protein", "carbs", "fat"][i];
                    const backgroundColor = [Colors.calories, Colors.protein, "#1BB14C", Colors.fat][i];
                    const abr = ["Cal", "P", "C", "F"][i];
                    const nAmount = food.nutrition[nutritionKey]*food.quantity;

                    return (
                        <View key={i} style={{backgroundColor, flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 9999, marginTop: 3}}>
                            <Text style={{color: "white", fontSize: 12, fontWeight: "800"}}>{nAmount}</Text>
                            <Text style={{color: "#dbdbdbff", fontSize: 9, fontWeight: "600", marginBottom: 1, marginLeft: 1}}>{abr}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
        {/* Serving input */}
        <View style={{height: size, justifyContent: "center", alignItems: "center", paddingRight: 10 }}>
            <View style={{height: size/1.5, backgroundColor: "#333333", borderRadius: 10, justifyContent: 'center', alignItems: "center", paddingHorizontal: 10}}>
                <Text style={{color: "white", fontSize: 14, fontWeight: "600",}}>{food.quantity} {food.unit}</Text>
            </View>
            
        </View>
    </View>
  )
}

export default PlateItem

const styles = StyleSheet.create({})