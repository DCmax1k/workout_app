import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActionMenu from '../ActionMenu'
import threeEllipses from '../../assets/icons/threeEllipses.png'
import { truncate } from '../../util/truncate'
import MacrosRow from './MacrosRow'
import ThemedText from '../ThemedText'
import formatDate from '../../util/formatDate'
import { useUserStore } from '../../stores/useUserStore'
import getDateKey from '../../util/getDateKey'
import { Colors } from '../../constants/Colors'
import sinceWhen from '../../util/sinceWhen'

const ConsumedMealCard = ({style, meal, requestRemoveMeal, ...props}) => {

    const getFoodsDescription = () => {
        const foods = meal.fullMeal.foods;
        let desc = " - ";
        if (foods.length === 1) return desc+foods[0].name;
        foods.forEach((food, i) => {
            const lastItem = i===foods.length-1;
            let str = food.name;
            if (!lastItem) str+=", ";
            desc+=str;
        });
        return desc;
    }

    const mealNutrition = meal.totalNutrition;

  return (
    <View {...props} style={[{width: "100%", backgroundColor: "#202020", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10, justifyContent: "center", alignItems: "center",}, style]}>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",}}>
            <View style={{flexDirection: "row", marginBottom: 4}}>
                <Text style={{color: "white", fontSize: 14, fontWeight: "600"}}>{meal.name}</Text>
                <Text  style={{color: "#BCBCBC", fontSize: 14, fontWeight: "300"}}>{truncate(getFoodsDescription(), 20)}</Text>
            </View>
            <View style={{height: 10, width: 20}}>
                <Image source={threeEllipses} style={{objectFit: "contain", height: "100%", width: "100%", tintColor: "#999999ff"}} />
            </View>
            {/* <ActionMenu data={[
                            {title: "Delete Meal", icon: trashIcon, onPress: () => requestRemoveMeal(meal), color: Colors.redText },
            ]} /> */}
        </View>
        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <ThemedText style={{fontSize: 13}}>{sinceWhen(meal.date ?? new Date())}</ThemedText>
            <MacrosRow nutrition={mealNutrition} />
        </View>
    </View>
  )
}

export default ConsumedMealCard

const styles = StyleSheet.create({})