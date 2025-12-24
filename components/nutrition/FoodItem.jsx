import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { icons } from '../../constants/icons';
import MacrosRow from './MacrosRow';
import { truncate } from '../../util/truncate';

const FoodItem = ({food, ...props}) => {
    const icon = food.icon ? icons[food.icon] : null;
  return (
    <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{flexDirection: "row", alignItems: "center",}}>
            <View
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: 5,
                    backgroundColor: food.color,
                    marginRight: 5,
                    overflow: "hidden",
                }}
            >

                <Image
                    source={icon}
                    contentFit='contain'
                    tintColor={food.iconColor ?? "white"}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                />
            </View>

            <Text style={{ color: "white", fontSize: 15 }}>
                {truncate(food.name, 22)}
            </Text>
        </View>
        
        <View style={{height: "100%", position: "absolute", right: 0, top: 0, justifyContent: 'center', alignItems: "center"}}>
            <MacrosRow nutrition={food.nutrition} multiplier={1} showDecimal={false} />
        </View>
        
    </View>
  )
}

export default FoodItem

const styles = StyleSheet.create({})